import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ example: 99900 })
  @IsNumber()
  @Min(0) //
  price: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  count: number;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}
