import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities/user.entity';
import { Roles } from '../../decorators/roles.decorator';
import { User } from '../../decorators/user.decorator';
import { AuthGuard } from '../../guards/jwt.guard';
import { RolesUser } from '../../guards/role.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { IdDto } from '../products/dto';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // создание категории
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RolesUser.admin])
  @ApiCreatedResponse({ description: 'Item loaded successfully' })
  @ApiOperation({ summary: 'Создание категории' })
  @Post('')
  async createCategory(@Body() body: CreateCategoryDto, @User('id') id: UserEntity['id']) {
    return await this.categoryService.createCategory(body, id);
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

  // редактирование категории
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RolesUser.admin])
  @ApiOkResponse({ description: 'Категория успешно изменена' })
  @ApiOperation({ summary: 'Изменение категории' })
  @Patch(':id')
  async updateCategoryId(@Param() id: IdDto, @Body() query: UpdateCategoryDto) {
    return await this.categoryService.updateCategoryId(id, query);
  }

  // удаление категории
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RolesUser.admin])
  @ApiOkResponse({ description: 'Категория успешно удалена' })
  @ApiOperation({ summary: 'Удаление категории' })
  @Delete(':id')
  async deleteCategoryId(@Param() id: IdDto) {
    return await this.categoryService.deleteCategoryId(id);
  }
}
