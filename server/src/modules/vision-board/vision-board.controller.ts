import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VisionBoardService } from './vision-board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardItemDto } from './dto/create-board-item.dto';
import { UpdateBoardItemDto } from './dto/update-board-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('vision-board')
export class VisionBoardController {
  constructor(private readonly visionBoardService: VisionBoardService) {}

  @Get()
  async getBoards(@CurrentUser('id') userId: string) {
    return this.visionBoardService.findAll(userId);
  }

  @Get(':id')
  async getBoard(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.visionBoardService.findOne(userId, id);
  }

  @Post()
  async createBoard(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBoardDto,
  ) {
    return this.visionBoardService.createBoard(userId, dto);
  }

  @Put(':id')
  async updateBoard(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.visionBoardService.updateBoard(userId, id, dto);
  }

  @Delete(':id')
  async deleteBoard(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.visionBoardService.deleteBoard(userId, id);
  }

  @Post('items')
  async createItem(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBoardItemDto,
  ) {
    return this.visionBoardService.createItem(userId, dto);
  }

  @Put('items/:id')
  async updateItem(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBoardItemDto,
  ) {
    return this.visionBoardService.updateItem(userId, id, dto);
  }

  @Delete('items/:id')
  async deleteItem(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.visionBoardService.deleteItem(userId, id);
  }
}
