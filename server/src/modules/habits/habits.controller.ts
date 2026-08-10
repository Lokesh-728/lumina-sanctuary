import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async getDailyTasks(
    @CurrentUser('id') userId: string,
    @Query('archived') archived?: string,
  ) {
    const isArchived = archived === 'true';
    return this.habitsService.getUserTasks(userId, isArchived);
  }

  @Post()
  async createTask(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.habitsService.createTask(userId, dto);
  }

  @Put(':id')
  async updateTask(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.habitsService.updateTask(userId, taskId, dto);
  }

  @Patch(':id/toggle')
  async toggleTask(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    return this.habitsService.toggleTask(userId, taskId);
  }

  @Patch(':id/archive')
  async archiveTask(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    return this.habitsService.archiveTask(userId, taskId);
  }

  @Patch(':id/restore')
  async restoreTask(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    return this.habitsService.restoreTask(userId, taskId);
  }

  @Delete(':id')
  async deleteTask(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    return this.habitsService.deleteTask(userId, taskId);
  }

  @Get('stats')
  async getStatistics(@CurrentUser('id') userId: string) {
    return this.habitsService.getStatistics(userId);
  }
}
