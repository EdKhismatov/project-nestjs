import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 99900 })
  @IsOptional()
  @IsNumber()
  @Min(0) //
  price?: number;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  count?: number;
}
