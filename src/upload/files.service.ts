import { MultipartFile } from '@fastify/multipart';
import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { PassThrough } from 'stream';
import * as uuid from 'uuid';
import { appConfig } from '../config';
import { BadRequestException } from '../exceptions';
import { MinioService } from '../module/minio/minio.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5 МБ
  constructor(private readonly minioService: MinioService) {}

  async createFile(file: MultipartFile): Promise<string> {
    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`Недопустимый формат: ${file.mimetype}`);
    }

    const fileName = uuid.v4() + '.webp';

    const sizeValidator = new PassThrough();
    let downloadedBytes = 0;

    sizeValidator.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (downloadedBytes > this.MAX_SIZE) {
        sizeValidator.destroy(new BadRequestException('Файл слишком большой (max 5MB)'));
      }
    });

    const transformer = sharp().resize(800).webp({ quality: 80 });

    const processedStream = file.file.pipe(sizeValidator).pipe(transformer);

    await this.minioService.uploadFile(appConfig.minio.minioBucket, fileName, processedStream as any);
    return fileName;
  }

  // Новый метод для массива файлов
  async createFiles(files: any[]): Promise<string[]> {
    const fileNames: string[] = [];
    for (const file of files) {
      const name = await this.createFile(file);
      fileNames.push(name);
    }
    return fileNames;
  }

  // удаление
  async removeImage(fileName: string) {
    return await this.minioService.deleteFile(appConfig.minio.minioBucket, fileName);
  }
  async onApplicationShutdown() {
    this.logger.log('--- Завершение работы FileService ---');
  }
}
