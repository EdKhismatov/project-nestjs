import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryEntity } from '../../database/entities/category.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [AuthModule, UserModule, SequelizeModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [SequelizeModule, CategoryService],
})
export class CategoryModule {}
