import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJournalDto } from './dto/create-journal.dto';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateJournalDto) {
    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          userId,
          title: dto.title,
          content: dto.content,
          tags: dto.tags || [],
          mood: dto.mood,
          imageUrl: dto.imageUrl,
          prompt: dto.prompt,
        },
      });

      await tx.userProgress.update({
        where: { userId },
        data: { totalReflections: { increment: 1 } },
      });

      return entry;
    });
  }

  async remove(userId: string, id: string) {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, userId },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    return this.prisma.journalEntry.delete({
      where: { id },
    });
  }
}
