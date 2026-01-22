import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/jwt.guard';
import { CategoryService } from './category.service';
import type { CategoryRequest } from './dto/category.types';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // создание товара
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ description: 'Item loaded successfully' })
  @ApiOperation({ summary: 'Создание категории' })
  @Post('')
  async createCategory(@Body() body: CreateCategoryDto, @Request() req: CategoryRequest) {
    console.log(body);
    console.log(req.user.id);
    return await this.categoryService.createCategory(body, req.user.id);
  }
}
