import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AffirmationsService } from './affirmations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateAffirmationDto } from './dto/create-affirmation.dto';
import { UpdateAffirmationDto } from './dto/update-affirmation.dto';

@UseGuards(JwtAuthGuard)
@Controller('affirmations')
export class AffirmationsController {
  constructor(private readonly affirmationsService: AffirmationsService) {}

  @Get('categories')
  async getCategories(@CurrentUser('id') userId: string) {
    return this.affirmationsService.getCategories(userId);
  }

  @Post('categories')
  async createCategory(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.affirmationsService.createCategory(userId, dto);
  }

  @Put('categories/:id')
  async updateCategory(
    @CurrentUser('id') userId: string,
    @Param('id') categoryId: string,
    @Body('name') name: string,
  ) {
    return this.affirmationsService.updateCategory(userId, categoryId, name);
  }

  @Delete('categories/:id')
  async deleteCategory(
    @CurrentUser('id') userId: string,
    @Param('id') categoryId: string,
  ) {
    return this.affirmationsService.deleteCategory(userId, categoryId);
  }

  @Get()
  async getAffirmations(
    @CurrentUser('id') userId: string,
    @Query('categoryId') categoryId?: string,
    @Query('favorite') favorite?: string,
    @Query('todayFeatured') todayFeatured?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ) {
    return this.affirmationsService.getAffirmations(
      userId,
      categoryId,
      favorite === 'true',
      todayFeatured === 'true',
      tag,
      search,
    );
  }

  @Get('random')
  async getRandom(
    @CurrentUser('id') userId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.affirmationsService.getRandomAffirmation(userId, categoryId);
  }

  @Get('analytics')
  async getAnalytics(@CurrentUser('id') userId: string) {
    return this.affirmationsService.getAnalytics(userId);
  }

  @Post('recite')
  async recordRecitation(@CurrentUser('id') userId: string) {
    return this.affirmationsService.recordRecitation(userId);
  }

  @Post()
  async createAffirmation(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAffirmationDto,
  ) {
    return this.affirmationsService.createAffirmation(userId, dto);
  }

  @Put(':id')
  async updateAffirmation(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAffirmationDto,
  ) {
    return this.affirmationsService.updateAffirmation(userId, id, dto);
  }

  @Delete(':id')
  async deleteAffirmation(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.affirmationsService.deleteAffirmation(userId, id);
  }
}
