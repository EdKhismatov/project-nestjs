import contentParser from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as process from 'node:process';
import { join } from 'path';
import { AppModule } from './app.module';
import { bootstrapSwagger } from './bootstrap';
import { appConfig } from './config';
import { Environment } from './config/dto';
import { DEVELOPMENT_STRATEGY, PinoService, PRODUCTION_STRATEGY } from './logger';

async function bootstrap() {
  const pinoStrategy = process.env.NODE_ENV === Environment.DEV ? DEVELOPMENT_STRATEGY : PRODUCTION_STRATEGY;
  const logger = new PinoService(pinoStrategy);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { logger });

  await bootstrapSwagger(app);

  app.useStaticAssets({
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
  });
  // attachFieldsToBody: true,
  await app.register(contentParser, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 МБ
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(appConfig.port, () => {
    logger.log(`The server started listening for incoming connections on port ${appConfig.port}`, 'Bootstrap');
  });
}
bootstrap();
