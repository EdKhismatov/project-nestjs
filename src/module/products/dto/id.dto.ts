import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdDto {
  @ApiProperty({ example: '4f715ca2-ce65-4836-b2e5-8e5d3e2a03b8' })
  @IsUUID('4')
  id: string;
}
