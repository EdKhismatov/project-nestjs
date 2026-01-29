import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CacheTime } from '../../cache/cache.constants';
import { cacheProductsAll, cacheProductsId, cacheProductsMy } from '../../cache/cache.keys';
import { RedisService } from '../../cache/redis.service';
import { appConfig } from '../../config';
import { CategoryEntity } from '../../database/entities/category.entity';
import { ProductsEntity } from '../../database/entities/products.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { ForbiddenException, NotFoundException } from '../../exceptions';
import { FilesService } from '../../upload/files.service';
import { IdDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsQueryDto } from './dto/get-products.query.dto';
import { IActiveUser } from './dto/product.types';
import { UpdateProductDto } from './dto/update-product.dto';

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

    private filesService: FilesService,
  ) {}

  // все товары
  async getProductsAll(query: GetProductsQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const offset = (page - 1) * limit;

    const key = `${JSON.stringify(query)}`;
    // const cashProduct = await this.redisService.get(cacheProductsAll(key));
    // if (cashProduct) {
    //   this.logger.log(`Достали из Redis`);
    //   return cashProduct;
    // }

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

    const baseUrl = `http://localhost:${appConfig.minio.minioPort}/${appConfig.minio.minioBucket}/`;

    const resultRows = rows.map((product) => {
      const productData = product.toJSON();
      productData.images = product.images.map((fileName) => `${baseUrl}${fileName}`);
      return productData;
    });

    const productAll = {
      items: resultRows,
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

    await this.redisService.set(key, product, { EX: CacheTime.min5 });

    this.logger.log(`Записали в Redis`);
    return product;
  }

  async createProduct(body: CreateProductDto) {
    const product = await this.productsEntity.create({ ...body });
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

    if (product.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException(`У вас недостаточно прав для удаления этого товара`);
    }

    if (product.images && product.images.length > 0) {
      for (const fileName of product.images) {
        await this.filesService.removeImage(fileName);
      }
    }

    await this.productsEntity.destroy({ where: { id: idDto.id } });

    await this.redisService.delete(cacheProductsId(idDto.id));

    this.logger.log(`Товар c id:${idDto.id} успешно удален из Redis`);
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

  // редактирование тавара
  async updateMyProduct(idDto: IdDto, dto: UpdateProductDto, user: IActiveUser) {
    const product = await this.productsEntity.findByPk(idDto.id);
    if (!product) {
      throw new NotFoundException(`Товар с ID ${idDto.id} не найден`);
    }

    if (product.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException(`У вас нет прав на редактирование этого товара`);
    }

    await product.update(dto);
    this.logger.log(`Товар усппешно изменен`);

    await Promise.all([
      this.redisService.delete(cacheProductsId(idDto.id)),
      this.redisService.delete(cacheProductsMy(user.id)),
    ]);

    this.logger.log(`Удален из Redis`);
    return product;
  }

  async onApplicationShutdown() {
    this.logger.log('--- Завершение работы ProductService ---');
  }
}
