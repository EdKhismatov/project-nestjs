import { Body, Controller, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { IdDto } from '../products/dto';
import { CategoryService } from './category.service';
import type { CategoryRequest } from './dto/category.types';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // создание категории
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @ApiCreatedResponse({ description: 'Item loaded successfully' })
  @ApiOperation({ summary: 'Создание категории' })
  @Post('')
  async createCategory(@Body() body: CreateCategoryDto, @Request() req: CategoryRequest) {
    return await this.categoryService.createCategory(body, req.user.id);
  }

  // получение всех категорий
  @ApiCreatedResponse({ description: 'Categories loaded successfully' })
  @ApiOperation({ summary: 'Категории' })
  @Get('')
  async getCategoryAll() {
    return await this.categoryService.getCategoryAll();
  }

  // получение категории и все товары в ней
  @ApiOkResponse({ description: 'Категория и товары успешно загружены' })
  @ApiOperation({ summary: 'Категория и товары загружены' })
  @Get(':id')
  async getCategoryId(@Param() id: IdDto) {
    const result = await this.categoryService.getCategoryId(id);
    if (!result) {
      throw new NotFoundException(`Категория с ID ${id.id} не найдена`);
    }
    return result;
  }
}
