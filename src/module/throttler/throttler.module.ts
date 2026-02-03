import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from '../../config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => [
        {
          ttl: appConfig.throttler.throttlerTtl,
          limit: appConfig.throttler.throttlerLimit,
          skipIf: (context) => {
            const request = context.switchToHttp().getRequest();
            console.log(`--- Запрос: ${request.method} ${request.url} ---`);
            return false; // пока ничего не скипаем, просто смотрим логи
          },
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ThrottlerLimitModule {}
