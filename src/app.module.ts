import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { CategoryModule } from './module/category/category.module';
import { EmailModule } from './module/mailer/email.module';
import { ProductsModule } from './module/products/products.module';

@Module({
  imports: [DatabaseModule, AuthModule, ProductsModule, CategoryModule, EmailModule],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
