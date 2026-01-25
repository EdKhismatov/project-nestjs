import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisModule } from '../../cache/redis.module';
import { CategoryEntity } from '../../database/entities/category.entity';
import { ProductsEntity } from '../../database/entities/products.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [AuthModule, UserModule, RedisModule, SequelizeModule.forFeature([CategoryEntity, ProductsEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [SequelizeModule],
})
export class CategoryModule {}
