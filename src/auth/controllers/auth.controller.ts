import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { RegisterService } from '../services/register.service';
import { ResponseFormat } from '../../global/interfaces/response-format.interface';
import { ResponseBuilder } from '../../global/utils/response-builder.util';
import { RegisterDto } from '../dto/register.dto';
import { LoginService } from '../services/login.service';
import { LoginDto } from '../dto/login.dto';

@Controller('')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) {}

  @Post('register')
  @ApiOkResponse({ description: 'Success Register' })
  public async Register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseFormat> {
    const newUser = await this.registerService.userRegister(registerDto);
    return ResponseBuilder.SuccessResponse(
      'Success register',
      HttpStatus.CREATED,
      newUser,
    );
  }

  @Post('login')
  @ApiOkResponse({ description: 'Success Login' })
  public async Login(@Body() loginDto: LoginDto): Promise<ResponseFormat> {
    const userLogin = await this.loginService.userLogin(loginDto);
    return ResponseBuilder.SuccessResponse(
      'Success login',
      HttpStatus.OK,
      userLogin,
    );
  }
}
