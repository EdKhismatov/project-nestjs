import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'iPhone 15 Pro' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Лучший смартфон 2024 года' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 99900 })
  @IsOptional()
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0) //
  price?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  count?: number;
}
