import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CacheTime } from '../../cache/cache.constants';
import { cacheProductsAll, cacheProductsId, cacheProductsMy } from '../../cache/cache.keys';
import { RedisService } from '../../cache/redis.service';
import { CategoryEntity } from '../../database/entities/category.entity';
import { ProductsEntity } from '../../database/entities/products.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { ForbiddenException, NotFoundException } from '../../exceptions';
import { IdDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsQueryDto } from './dto/get-products.query.dto';
import { IActiveUser } from './dto/product.types';

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

    private readonly redisService: RedisService,
  ) {}

  // все товары
  async getProductsAll(query: GetProductsQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const offset = (page - 1) * limit;

    const key = `${JSON.stringify(query)}`;
    const cashProduct = await this.redisService.get(cacheProductsAll(key));
    if (cashProduct) {
      this.logger.log(`Достали из Redis`);
      return cashProduct;
    }

    const where: any = {};
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    const { rows, count } = await this.productsEntity.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: this.categoryEntity, as: 'category' }],
      order: [['createdAt', 'DESC']],
    });

    const productAll = {
      items: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };

    await this.redisService.set(cacheProductsAll(key), productAll, { EX: CacheTime.min5 });
    this.logger.log(`Записали в Redis`);

    return productAll;
  }

  // товар по id
  async getProductsId(idDto: IdDto) {
    const key = cacheProductsId(idDto.id);

    const cashProduct = await this.redisService.get(key);
    if (cashProduct) {
      this.logger.log(`Достали из Redis`);
      return cashProduct;
    }

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

    const plainProduct = product.get({ plain: true });
    await this.redisService.set(key, plainProduct, { EX: CacheTime.min5 });

    this.logger.log(`Записали в Redis`);
    return product;
  }

  // создание товара
  async createProducts(body: CreateProductDto, userId: string) {
    const product = await this.productsEntity.create({ ...body, userId });
    this.logger.log(`Товар успешно создан`);
    return product;
  }

  // удаление товара
  async delete(idDto: IdDto, user: IActiveUser) {
    const product = await this.productsEntity.findOne({
      where: { id: idDto.id },
    });
    if (!product) {
      throw new NotFoundException(`Товар с ID ${idDto.id} не найден`);
    }

    const plainProduct = product.get({ plain: true });

    if (plainProduct.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException(`У вас недостаточно прав для удаления этого товара`);
    }
    await this.productsEntity.destroy({ where: { id: idDto.id } });

    await this.redisService.delete(cacheProductsId(idDto.id));

    this.logger.log(`Товар c id:${idDto.id} успешно удален`);
    return { success: true };
  }

  // товары продавца
  async getMyProduct(user: IActiveUser) {
    const key = cacheProductsMy(user.id);
    const myProducts = await this.redisService.get(key);
    if (myProducts) {
      this.logger.log(`Достали из Redis продукты которые пренадлежат seller`);
      return myProducts;
    }

    const products = await this.productsEntity.findAll({
      where: { userId: user.id },
      include: [{ model: this.categoryEntity, as: 'category' }],
    });

    await this.redisService.set(key, products, { EX: CacheTime.min5 });
    this.logger.log(`Записали в Redis`);

    return products;
  }
}
