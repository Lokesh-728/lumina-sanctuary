import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateAffirmationDto } from './dto/create-affirmation.dto';
import { UpdateAffirmationDto } from './dto/update-affirmation.dto';

const DEFAULT_CATEGORIES = [
  'Confidence',
  'Money',
  'Health',
  'Career',
  'Study',
  'Business',
  'Relationships',
];

@Injectable()
export class AffirmationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(userId: string) {
    let categories = await this.prisma.affirmationCategory.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
    });

    if (categories.length === 0) {
      // Seed default categories for new user
      await this.prisma.affirmationCategory.createMany({
        data: DEFAULT_CATEGORIES.map((name, idx) => ({
          userId,
          name,
          sortOrder: idx,
        })),
      });

      categories = await this.prisma.affirmationCategory.findMany({
        where: { userId },
        orderBy: { sortOrder: 'asc' },
      });
    }

    return categories;
  }

  async createCategory(userId: string, dto: CreateCategoryDto) {
    return this.prisma.affirmationCategory.create({
      data: {
        userId,
        name: dto.name,
        sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async updateCategory(userId: string, categoryId: string, name: string) {
    const category = await this.prisma.affirmationCategory.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.affirmationCategory.update({
      where: { id: categoryId },
      data: { name },
    });
  }

  async deleteCategory(userId: string, categoryId: string) {
    const category = await this.prisma.affirmationCategory.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found or unauthorized');
    }

    await this.prisma.affirmation.deleteMany({
      where: { categoryId, userId },
    });

    await this.prisma.affirmationCategory.delete({
      where: { id: categoryId },
    });

    return { success: true };
  }

  async getAffirmations(
    userId: string,
    categoryId?: string,
    favorite?: boolean,
    todayFeatured?: boolean,
    tag?: string,
    search?: string,
  ) {
    const where: any = { userId };

    if (categoryId) where.categoryId = categoryId;
    if (favorite) where.isFavorite = true;
    if (todayFeatured) where.isTodayFeatured = true;
    if (tag) where.tags = { has: tag };
    if (search) {
      where.text = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.affirmation.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAffirmation(userId: string, dto: CreateAffirmationDto) {
    // If setting as today's featured, unfeature previous
    if (dto.isTodayFeatured) {
      await this.prisma.affirmation.updateMany({
        where: { userId, isTodayFeatured: true },
        data: { isTodayFeatured: false },
      });
    }

    return this.prisma.affirmation.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        text: dto.text,
        isFavorite: dto.isFavorite || false,
        isTodayFeatured: dto.isTodayFeatured || false,
        tags: dto.tags || [],
        audioUrl: dto.audioUrl,
      },
      include: {
        category: true,
      },
    });
  }

  async updateAffirmation(
    userId: string,
    id: string,
    dto: UpdateAffirmationDto,
  ) {
    const affirmation = await this.prisma.affirmation.findFirst({
      where: { id, userId },
    });

    if (!affirmation) {
      throw new NotFoundException('Affirmation not found');
    }

    if (dto.isTodayFeatured) {
      await this.prisma.affirmation.updateMany({
        where: { userId, isTodayFeatured: true },
        data: { isTodayFeatured: false },
      });
    }

    return this.prisma.affirmation.update({
      where: { id },
      data: {
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.text !== undefined && { text: dto.text }),
        ...(dto.isFavorite !== undefined && { isFavorite: dto.isFavorite }),
        ...(dto.isTodayFeatured !== undefined && { isTodayFeatured: dto.isTodayFeatured }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.audioUrl !== undefined && { audioUrl: dto.audioUrl }),
      },
      include: { category: true },
    });
  }

  async deleteAffirmation(userId: string, id: string) {
    const affirmation = await this.prisma.affirmation.findFirst({
      where: { id, userId },
    });

    if (!affirmation) {
      throw new NotFoundException('Affirmation not found');
    }

    await this.prisma.affirmation.delete({ where: { id } });
    return { success: true };
  }

  async getRandomAffirmation(userId: string, categoryId?: string) {
    const where: any = { userId };
    if (categoryId) where.categoryId = categoryId;

    const list = await this.prisma.affirmation.findMany({
      where,
      include: { category: true },
    });

    if (list.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  async getAnalytics(userId: string) {
    let analytics = await this.prisma.affirmationAnalytics.findUnique({
      where: { userId },
    });

    if (!analytics) {
      analytics = await this.prisma.affirmationAnalytics.create({
        data: { userId },
      });
    }

    const totalCount = await this.prisma.affirmation.count({ where: { userId } });
    const favoriteCount = await this.prisma.affirmation.count({
      where: { userId, isFavorite: true },
    });
    const todayFeatured = await this.prisma.affirmation.findFirst({
      where: { userId, isTodayFeatured: true },
      include: { category: true },
    });

    return {
      ...analytics,
      totalAffirmations: totalCount,
      favoriteCount,
      todayFeatured,
    };
  }

  async recordRecitation(userId: string) {
    let analytics = await this.prisma.affirmationAnalytics.findUnique({
      where: { userId },
    });

    if (!analytics) {
      analytics = await this.prisma.affirmationAnalytics.create({
        data: { userId },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = analytics.lastRecitationDate
      ? new Date(analytics.lastRecitationDate)
      : null;

    let currentStreak = analytics.currentStreak;
    if (!lastDate) {
      currentStreak = 1;
    } else {
      lastDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    const longestStreak = Math.max(analytics.longestStreak, currentStreak);

    return this.prisma.affirmationAnalytics.update({
      where: { userId },
      data: {
        totalRecitations: { increment: 1 },
        dailyRecitations: { increment: 1 },
        weeklyRecitations: { increment: 1 },
        currentStreak,
        longestStreak,
        lastRecitationDate: new Date(),
      },
    });
  }
}
