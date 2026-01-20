import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { bootstrapSwagger } from './bootstrap';
import { portConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  await bootstrapSwagger(app);

  await app.listen(portConfig.port);
}
bootstrap();
