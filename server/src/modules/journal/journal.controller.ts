import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  async getEntries(@CurrentUser('id') userId: string) {
    return this.journalService.findAll(userId);
  }

  @Post()
  async createEntry(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateJournalDto,
  ) {
    return this.journalService.create(userId, dto);
  }

  @Delete(':id')
  async deleteEntry(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.journalService.remove(userId, id);
  }
}
