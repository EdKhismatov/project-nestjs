import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Электроника' })
  @IsOptional()
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @MinLength(3, { message: 'Минимальная длина названия — 3 символа' })
  @MaxLength(50, { message: 'Максимальная длина названия — 50 символов' })
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Получение товара' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'ЛУчшая электроника' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;
}
