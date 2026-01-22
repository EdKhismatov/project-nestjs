import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryEntity } from '../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryEntity)
    private categoryEntity: typeof CategoryEntity,
  ) {}

  // создание категории
  async createCategory(body: CreateCategoryDto, id: string) {
    const category = await this.categoryEntity.create({ ...body, userId: id });
    return category;
  }
}
