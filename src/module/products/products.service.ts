import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryEntity } from '../../database/entities/category.entity';
import { ProductsEntity } from '../../database/entities/products.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { NotFoundException } from '../../exceptions';
import { IdDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(ProductsEntity)
    private productsEntity: typeof ProductsEntity,

    @InjectModel(CategoryEntity)
    private categoryEntity: typeof CategoryEntity,

    @InjectModel(UserEntity)
    private userEntity: typeof UserEntity,

    // private readonly redisService: RedisService,
  ) {}

  // все товары
  async getProductsAll() {
    const products = await this.productsEntity.findAll();
    return products;
  }

  // товар по id
  async getProductsId(idDto: IdDto) {
    const product = await this.productsEntity.findOne({
      where: { id: idDto.id },
      include: [
        {
          model: this.categoryEntity,
          as: 'category',
          attributes: ['title', 'slug'],
        },
        {
          model: this.userEntity,
          as: 'seller',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!product) {
      throw new NotFoundException(`Товар с ID ${idDto.id} не найден`);
    }
    this.logger.log(`Товар с ID ${idDto.id} найден`);
    return product;
  }

  // создание товара
  async createProducts(body: CreateProductDto, userId: string) {
    const product = await this.productsEntity.create({ ...body, userId });
    this.logger.log(`Товар успешно создан`);
    return product;
  }
}
