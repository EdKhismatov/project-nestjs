import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { bootstrapSwagger } from './bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  bootstrapSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
