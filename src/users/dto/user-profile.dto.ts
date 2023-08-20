import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class PhysicalMeasurementDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  value: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  unit: string;
}

export class UserProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  displayName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  gender: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  birthday: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  profileImage?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  horoscope?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  zodiac?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  height?: PhysicalMeasurementDto;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  weight?: PhysicalMeasurementDto;
}
