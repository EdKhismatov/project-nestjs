import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  @Length(6, 100)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 512)
  password: string;

  @ApiProperty()
  @IsString()
  role: string;
}
