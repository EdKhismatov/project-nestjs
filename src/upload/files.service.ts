import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import sharp from 'sharp';
import * as uuid from 'uuid';
import { BadRequestException } from '../exceptions';

@Injectable()
export class FilesService {
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5 МБ

  async createFile(file: any): Promise<string> {
    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`Недопустимый формат файла: ${file.mimetype}. Разрешены: JPG, PNG, WEBP`);
    }

    const buffer = await file.toBuffer();

    if (buffer.length > this.MAX_SIZE) {
      throw new BadRequestException('Файл слишком большой. Максимальный размер: 5 МБ');
    }

    const fileName = uuid.v4() + '.webp';

    const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

    const fullPath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await sharp(buffer).resize(800).webp({ quality: 80 }).toFile(fullPath);

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
  async removeFile(fileName: string) {
    try {
      const filePath = join(__dirname, '..', '..', 'uploads', fileName);
      await fs.promises.unlink(filePath);
      return true;
    } catch (e) {
      console.error(`Ошибка при удалении файла ${fileName}:`, e.message);
      return false;
    }
  }
}
