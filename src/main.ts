import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as process from 'node:process';
import { AppModule } from './app.module';
import { bootstrapSwagger } from './bootstrap';
import { appConfig } from './config';
import { Environment } from './config/dto';
import { DEVELOPMENT_STRATEGY, PinoService, PRODUCTION_STRATEGY } from './logger';

async function bootstrap() {
  const pinoStrategy = process.env.NODE_ENV === Environment.DEV ? DEVELOPMENT_STRATEGY : PRODUCTION_STRATEGY;
  const logger = new PinoService(pinoStrategy);

  const app = await NestFactory.create<INestApplication>(AppModule, new FastifyAdapter(), { logger });

  await bootstrapSwagger(app);

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
