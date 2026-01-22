import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsEntity } from '../../database/entities/products.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../users/user.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule, UserModule, CategoryModule, SequelizeModule.forFeature([ProductsEntity])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [SequelizeModule],
})
export class ProductsModule {}
