import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CacheTime } from '../../cache/cache.constants';
import { cacheCategoriesAll, cacheCategoriesId } from '../../cache/cache.keys';
import { RedisService } from '../../cache/redis.service';
import { CategoryEntity } from '../../database/entities/category.entity';
import { ProductsEntity } from '../../database/entities/products.entity';
import { NotFoundException } from '../../exceptions';
import { IdDto } from '../products/dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  logger = new Logger(CategoryService.name);
  constructor(
    @InjectModel(CategoryEntity)
    private categoryEntity: typeof CategoryEntity,

    @InjectModel(ProductsEntity)
    private productsEntity: typeof ProductsEntity,

    private readonly redisService: RedisService,
  ) {}

  // создание категории
  async createCategory(body: CreateCategoryDto, userId: string) {
    try {
      return await this.categoryEntity.create({ ...body, userId });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Категория с таким названием уже существует');
      }
      throw new InternalServerErrorException('Ошибка при создании категории');
    }
  }

  // все категории с товарами
  async getCategoryAll() {
    const categories = await this.redisService.get(cacheCategoriesAll());

    if (categories) {
      this.logger.log(`Достали из Redis`);
      return categories;
    }

    try {
      const category = await this.categoryEntity.findAll({
        attributes: ['id', 'title', 'slug'],
        include: [
          {
            model: this.productsEntity,
            as: 'products',
            attributes: ['id', 'title', 'description', 'price', 'count'],
          },
        ],
        order: [['title', 'ASC']],
      });
      await this.redisService.set(cacheCategoriesAll(), category, { EX: CacheTime.min5 });
      this.logger.log(`Записали в Redis`);
      return category;
    } catch (error) {
      this.logger.log(`Ошибка при получении категорий: ${error.message}`);
      throw new InternalServerErrorException('Ошибка при чтении категорий');
    }
  }

  // получение категории и все товары в ней
  async getCategoryId(id: IdDto) {
    const categories = await this.redisService.get(cacheCategoriesId(id.id));

    if (categories) {
      this.logger.log(`Достали из Redis`);
      return categories;
    }

    try {
      const category = await this.categoryEntity.findOne({
        where: { id: id.id },
        attributes: ['id', 'title', 'description'],
        include: [
          {
            model: this.productsEntity,
            as: 'products',
            attributes: ['id', 'title', 'description', 'price', 'count'],
          },
        ],
      });
      if (category) {
        await this.redisService.set(cacheCategoriesId(id.id), category, { EX: CacheTime.min5 });
        this.logger.log(`Записали в Redis`);
      }
      return category;
    } catch (error) {
      this.logger.log(`Ошибка при получении категории и товаров: ${error.message}`);
      throw new InternalServerErrorException('Ошибка при чтении категорий');
    }
  }

  // изменение категории
  async updateCategoryId(id: IdDto, query: UpdateCategoryDto) {
    const category = await this.categoryEntity.findByPk(id.id);
    if (!category) {
      throw new NotFoundException(`Категория с ID ${id.id} не найдена`);
    }
    this.redisService.delete(cacheCategoriesId(id.id));
    this.logger.log(`Категория с id:${id.id} удалена из Redis`);
    await category.update(query);
    this.logger.log(`Категория усппешно изменена`);
    return category;
  }

  // удаление категории
  async deleteCategoryId(id: IdDto) {
    const category = await this.categoryEntity.findByPk(id.id);
    if (!category) {
      throw new NotFoundException(`Категория с ID ${id.id} не найдена`);
    }

    await category.destroy();
    try {
      await this.redisService.delete(cacheCategoriesId(id.id));
      this.logger.log(`Категория с id:${id.id} удалена из Redis`);
    } catch (err) {
      this.logger.error(`Ошибка при удалении из Redis для id:${id.id}`, err);
    }

    return category;
  }

  async onApplicationShutdown() {
    this.logger.log('--- Завершение работы CategoryService ---');
  }
}
