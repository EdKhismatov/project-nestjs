import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AppConfigDto {
  @IsNumber()
  @Type(() => Number)
  readonly port: number;
}
