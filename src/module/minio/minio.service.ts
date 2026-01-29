import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { appConfig } from '../../config';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: appConfig.minio.minioPort,
      useSSL: false,
      accessKey: appConfig.minio.minioUser,
      secretKey: appConfig.minio.minioPassword,
    });
  }

  // Геттер для прямого доступа к методам SDK
  get client() {
    return this.minioClient;
  }

  async uploadFile(bucket: string, fileName: string, buffer: Buffer) {
    return await this.minioClient.putObject(bucket, fileName, buffer);
  }

  async deleteFile(bucket: string, fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucket, fileName);
    } catch (err) {
      console.error(`Ошибка при удалении файла ${fileName} из MinIO:`, err);
    }
  }
}
