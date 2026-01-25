import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @MinLength(3, { message: 'Минимальная длина названия — 3 символа' })
  @MaxLength(50, { message: 'Максимальная длина названия — 50 символов' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;
}
