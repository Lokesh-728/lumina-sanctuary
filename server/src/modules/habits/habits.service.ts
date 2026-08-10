import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserTasks(userId: string, isArchived: boolean = false) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await this.prisma.dailyTask.findMany({
      where: { userId, isActive: true, isArchived },
      include: {
        completions: {
          where: { completedDate: today },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return tasks.map((task) => ({
      ...task,
      category: task.category.toLowerCase(),
      completed: task.completions.length > 0,
    }));
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    return this.prisma.dailyTask.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        category: dto.category || 'MORNING',
        priority: dto.priority || 'MEDIUM',
        estimatedTime: dto.estimatedTime,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        repeatFrequency: dto.repeatFrequency || 'NONE',
        isPinned: dto.isPinned || false,
      },
    });
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.dailyTask.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.dailyTask.update({
      where: { id: taskId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.estimatedTime !== undefined && { estimatedTime: dto.estimatedTime }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }),
        ...(dto.repeatFrequency !== undefined && { repeatFrequency: dto.repeatFrequency }),
        ...(dto.isPinned !== undefined && { isPinned: dto.isPinned }),
        ...(dto.isArchived !== undefined && { isArchived: dto.isArchived }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });
  }

  async toggleTask(userId: string, taskId: string) {
    const task = await this.prisma.dailyTask.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCompletion = await this.prisma.taskCompletion.findFirst({
      where: {
        taskId,
        completedDate: today,
      },
    });

    if (existingCompletion) {
      await this.prisma.taskCompletion.delete({
        where: { id: existingCompletion.id },
      });
      return { taskId, completed: false };
    } else {
      await this.prisma.taskCompletion.create({
        data: {
          taskId,
          userId,
          completedDate: today,
        },
      });
      return { taskId, completed: true };
    }
  }

  async archiveTask(userId: string, taskId: string) {
    return this.updateTask(userId, taskId, { isArchived: true });
  }

  async restoreTask(userId: string, taskId: string) {
    return this.updateTask(userId, taskId, { isArchived: false });
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.prisma.dailyTask.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.dailyTask.delete({
      where: { id: taskId },
    });

    return { success: true, message: 'Task deleted permanently' };
  }

  async getStatistics(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeTasks = await this.prisma.dailyTask.findMany({
      where: { userId, isActive: true, isArchived: false },
    });

    const completionsToday = await this.prisma.taskCompletion.findMany({
      where: { userId, completedDate: today },
    });

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const completionsWeek = await this.prisma.taskCompletion.findMany({
      where: {
        userId,
        completedDate: { gte: sevenDaysAgo },
      },
    });

    const dailyPercentage = activeTasks.length > 0 
      ? Math.round((completionsToday.length / activeTasks.length) * 100) 
      : 0;

    // Fetch all completions for the user to calculate real streaks and completion dates
    const allCompletions = await this.prisma.taskCompletion.findMany({
      where: { userId },
      orderBy: { completedDate: 'asc' },
    });

    // Collect unique completion dates as YYYY-MM-DD strings
    const dateSet = new Set<string>();
    allCompletions.forEach((c) => {
      const d = new Date(c.completedDate);
      dateSet.add(d.toISOString().split('T')[0]);
    });

    const dateList = Array.from(dateSet).sort();

    // Calculate current streak & longest streak from actual completion date history
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Current Streak calculation
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let checkDate = dateSet.has(todayStr) ? new Date(today) : (dateSet.has(yesterdayStr) ? yesterday : null);

    if (checkDate) {
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (dateSet.has(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Longest Streak calculation
    if (dateList.length > 0) {
      tempStreak = 1;
      longestStreak = 1;
      for (let i = 1; i < dateList.length; i++) {
        const prev = new Date(dateList[i - 1]);
        const curr = new Date(dateList[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    }

    return {
      totalTasks: activeTasks.length,
      completedToday: completionsToday.length,
      completedWeek: completionsWeek.length,
      dailyPercentage,
      weeklyConsistency: Math.min(100, Math.round((completionsWeek.length / (activeTasks.length * 7 || 1)) * 100)),
      currentStreak,
      longestStreak,
      completionDates: Array.from(dateSet),
    };
  }
}
