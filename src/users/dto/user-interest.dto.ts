import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UserInterestDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  interests: string[];
}
