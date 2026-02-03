import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { CategoryModule } from './module/category/category.module';
import { EmailModule } from './module/mailer/email.module';
import { ProductsModule } from './module/products/products.module';
import { ThrottlerLimitModule } from './module/throttler/throttler.module';
import { CronModule } from './providers/cron/cron.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ProductsModule,
    CategoryModule,
    EmailModule,
    ScheduleModule.forRoot(),
    CronModule,
    ThrottlerLimitModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
