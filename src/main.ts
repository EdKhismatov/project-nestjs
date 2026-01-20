import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { bootstrapSwagger } from './bootstrap';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  await bootstrapSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(appConfig.port);
}
bootstrap();
