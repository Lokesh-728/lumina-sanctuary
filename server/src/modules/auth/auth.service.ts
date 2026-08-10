import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const emailNormalized = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existing) {
      throw new ConflictException('Email address is already registered');
    }

    const rawPassword = dto.password || 'lumina_default_pass_2026';
    const passwordHash = await argon2.hash(rawPassword);

    try {
      // Create User first (no nested creates to bypass Prisma transaction requirements for standalone MongoDB)
      const user = await this.prisma.user.create({
        data: {
          email: emailNormalized,
          passwordHash,
          firstName: dto.firstName || 'Seeker',
          lastName: dto.lastName || '',
        },
      });

      // Create Profile separately
      await this.prisma.profile.create({
        data: {
          userId: user.id,
          primaryLocation: 'A sun-drenched sanctuary',
          atmosphereVibes: 'Natural light, quiet morning air, and focused space.',
          morningDiscipline: 'Breathwork, intention setting, and alignment.',
          wealthConsciousness: 'Abundance mindset',
          mottoQuote: 'I build my life intentional step by intentional step.',
        }
      });

      // Create UserProgress separately
      await this.prisma.userProgress.create({
        data: {
          userId: user.id,
          clarityScore: 75,
          totalReflections: 0,
        }
      });

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        tokens,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(`DB Error: ${error.message || error}`);
    }
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const rawPassword = dto.password || 'lumina_default_pass_2026';
    const isPasswordValid = await argon2.verify(user.passwordHash, rawPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken, userAgent, ipAddress);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.generateTokens(
      session.user.id,
      session.user.email,
      session.user.role,
    );

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      await this.prisma.session.deleteMany({
        where: {
          OR: [
            { refreshToken },
            { isRevoked: true },
            { expiresAt: { lt: new Date() } },
          ],
        },
      });
    }
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET') || 'secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh_secret',
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    // Automatic cleanup of expired or revoked sessions to keep MongoDB clean
    try {
      await this.prisma.session.deleteMany({
        where: {
          OR: [
            { userId, isRevoked: true },
            { userId, expiresAt: { lt: new Date() } },
          ],
        },
      });
    } catch (e) {
      // Ignore cleanup error if any
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });
  }
}
