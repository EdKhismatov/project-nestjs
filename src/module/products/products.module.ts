import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisModule } from '../../cache/redis.module';
import { CategoryEntity } from '../../database/entities/category.entity';
import { ProductsEntity } from '../../database/entities/products.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { FilesModule } from '../../upload/files.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RedisModule,
    FilesModule,
    SequelizeModule.forFeature([ProductsEntity, CategoryEntity, UserEntity]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [SequelizeModule],
})
export class ProductsModule {}
