import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  UserGender,
  UserHeightMeasurement,
  UserWeightMeasurement,
} from './users/constants/user.constant';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('General')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user-genders')
  getUserGenders(): string[] {
    return Object.values(UserGender);
  }

  @Get('height-units')
  getHeightUnits(): string[] {
    return Object.values(UserHeightMeasurement);
  }

  @Get('weight-units')
  getWeightUnits(): string[] {
    return Object.values(UserWeightMeasurement);
  }
}
