import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardItemDto } from './dto/create-board-item.dto';
import { UpdateBoardItemDto } from './dto/update-board-item.dto';

const DEFAULT_BOARDS = [
  {
    title: 'Dream Life & Sanctuary',
    subtitle: 'Physical environment, freedom, and peaceful sanctuary.',
    category: 'DREAM_HOME',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Financial Freedom & Wealth',
    subtitle: 'Wealth consciousness, investments, and scalable impact.',
    category: 'MONEY',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  },
];

@Injectable()
export class VisionBoardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    let boards = await this.prisma.visionBoard.findMany({
      where: { userId },
      include: { items: { orderBy: { zIndex: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    if (boards.length === 0) {
      // Create initial starter boards for new user
      for (const def of DEFAULT_BOARDS) {
        const board = await this.prisma.visionBoard.create({
          data: {
            userId,
            title: def.title,
            subtitle: def.subtitle,
            category: def.category as any,
            imageUrl: def.imageUrl,
          },
        });

        // Add initial sample items to first board
        if (def.category === 'DREAM_HOME') {
          await this.prisma.visionBoardItem.createMany({
            data: [
              {
                boardId: board.id,
                userId,
                itemType: 'IMAGE',
                title: 'Modern Architecture Studio',
                content: 'High ceilings, natural timber, peaceful sunlight.',
                imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                posX: 40,
                posY: 40,
                width: 320,
                height: 240,
                zIndex: 1,
              },
              {
                boardId: board.id,
                userId,
                itemType: 'NOTE',
                title: 'Daily Core Intention',
                content: 'My environment reflects clarity, abundance, and effortless execution.',
                bgColor: '#47624d',
                posX: 400,
                posY: 60,
                width: 280,
                height: 180,
                zIndex: 2,
              },
              {
                boardId: board.id,
                userId,
                itemType: 'GOAL',
                title: 'Dream Sanctuary Fund',
                goalTarget: 500000,
                goalProgress: 65,
                posX: 400,
                posY: 260,
                width: 280,
                height: 160,
                zIndex: 3,
              },
            ],
          });
        }
      }

      boards = await this.prisma.visionBoard.findMany({
        where: { userId },
        include: { items: { orderBy: { zIndex: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      });
    }

    return boards;
  }

  async findOne(userId: string, id: string) {
    const board = await this.prisma.visionBoard.findFirst({
      where: { id, userId },
      include: { items: { orderBy: { zIndex: 'asc' } } },
    });

    if (!board) {
      throw new NotFoundException('Vision board not found or unauthorized access');
    }

    return board;
  }

  async createBoard(userId: string, dto: CreateBoardDto) {
    return this.prisma.visionBoard.create({
      data: {
        userId,
        title: dto.title,
        subtitle: dto.subtitle,
        category: dto.category || 'DREAM_HOME',
        imageUrl: dto.imageUrl,
        layoutMode: dto.layoutMode || 'FREEFORM',
        isFavorite: dto.isFavorite || false,
      },
      include: { items: true },
    });
  }

  async updateBoard(userId: string, id: string, dto: UpdateBoardDto) {
    const board = await this.prisma.visionBoard.findFirst({
      where: { id, userId },
    });

    if (!board) {
      throw new NotFoundException('Vision board not found or unauthorized');
    }

    return this.prisma.visionBoard.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.layoutMode !== undefined && { layoutMode: dto.layoutMode }),
        ...(dto.isFavorite !== undefined && { isFavorite: dto.isFavorite }),
        ...(dto.isArchived !== undefined && { isArchived: dto.isArchived }),
      },
      include: { items: { orderBy: { zIndex: 'asc' } } },
    });
  }

  async deleteBoard(userId: string, id: string) {
    const board = await this.prisma.visionBoard.findFirst({
      where: { id, userId },
    });

    if (!board) {
      throw new NotFoundException('Vision board not found or unauthorized');
    }

    await this.prisma.visionBoardItem.deleteMany({ where: { boardId: id } });
    await this.prisma.visionBoard.delete({ where: { id } });

    return { success: true };
  }

  async createItem(userId: string, dto: CreateBoardItemDto) {
    const board = await this.prisma.visionBoard.findFirst({
      where: { id: dto.boardId, userId },
    });

    if (!board) {
      throw new NotFoundException('Vision board not found or unauthorized');
    }

    const isValidObjectId = (id?: string) => Boolean(id && typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id));

    return this.prisma.visionBoardItem.create({
      data: {
        userId,
        boardId: dto.boardId,
        itemType: dto.itemType,
        title: dto.title,
        content: dto.content,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        goalTarget: dto.goalTarget ? Number(dto.goalTarget) : undefined,
        goalProgress: dto.goalProgress ? Number(dto.goalProgress) : undefined,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        affirmationId: isValidObjectId(dto.affirmationId) ? dto.affirmationId : undefined,
        posX: dto.posX ?? 50,
        posY: dto.posY ?? 50,
        width: dto.width ?? 300,
        height: dto.height ?? 220,
        zIndex: dto.zIndex ?? 1,
        bgColor: dto.bgColor,
      },
    });
  }

  async updateItem(userId: string, id: string, dto: UpdateBoardItemDto) {
    const item = await this.prisma.visionBoardItem.findFirst({
      where: { id, userId },
    });

    if (!item) {
      throw new NotFoundException('Vision board item not found or unauthorized');
    }

    const isValidObjectId = (id?: string) => Boolean(id && typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id));

    return this.prisma.visionBoardItem.update({
      where: { id },
      data: {
        ...(dto.itemType !== undefined && { itemType: dto.itemType }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.linkUrl !== undefined && { linkUrl: dto.linkUrl }),
        ...(dto.goalTarget !== undefined && { goalTarget: Number(dto.goalTarget) }),
        ...(dto.goalProgress !== undefined && { goalProgress: Number(dto.goalProgress) }),
        ...(dto.targetDate !== undefined && { targetDate: new Date(dto.targetDate) }),
        ...(dto.affirmationId !== undefined && { affirmationId: isValidObjectId(dto.affirmationId) ? dto.affirmationId : null }),
        ...(dto.posX !== undefined && { posX: dto.posX }),
        ...(dto.posY !== undefined && { posY: dto.posY }),
        ...(dto.width !== undefined && { width: dto.width }),
        ...(dto.height !== undefined && { height: dto.height }),
        ...(dto.zIndex !== undefined && { zIndex: dto.zIndex }),
        ...(dto.bgColor !== undefined && { bgColor: dto.bgColor }),
      },
    });
  }

  async deleteItem(userId: string, id: string) {
    const item = await this.prisma.visionBoardItem.findFirst({
      where: { id, userId },
    });

    if (!item) {
      throw new NotFoundException('Vision board item not found or unauthorized');
    }

    await this.prisma.visionBoardItem.delete({ where: { id } });
    return { success: true };
  }
}
