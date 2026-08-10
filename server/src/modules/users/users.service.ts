import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        profile: true,
        userProgress: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User account not found');
    }

    return user;
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User account not found');
    }

    // Cascade delete user and all associated MongoDB documents
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account and associated data deleted successfully' };
  }
}
