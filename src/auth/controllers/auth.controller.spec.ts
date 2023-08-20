import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterDto } from '../dto/register.dto';
import { LoginService } from '../services/login.service';
import { RegisterService } from '../services/register.service';
import { ResponseFormat } from '../../global/interfaces/response-format.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../users/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../interfaces/login-response.interface';

describe('AuthController', () => {
  let authController: AuthController;
  let registerService: RegisterService;
  let loginService: LoginService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: getModelToken('User'),
          useValue: User,
        },
        JwtService,
        RegisterService,
        LoginService,
      ],
      exports: [RegisterService, LoginService],
    }).compile();

    registerService = moduleRef.get<RegisterService>(RegisterService);
    loginService = moduleRef.get<LoginService>(LoginService);
    authController = new AuthController(registerService, loginService);
  });

  describe('userRegister', () => {
    it('should success register', async () => {
      const userName = 'user' + Math.floor(Math.random() * 1000 + 1);
      const serviceResult: IUser = {
        username: userName,
        email: `${userName}@mail.com`,
        id: 'xxx',
        password: 'password',
      };

      const result: ResponseFormat = {
        success: true,
        message: 'Success register',
        statusCode: HttpStatus.CREATED,
        data: serviceResult,
      };
      jest
        .spyOn(registerService, 'userRegister')
        .mockImplementation(async () => serviceResult);

      const registerDto: RegisterDto = {
        email: `${userName}@mail.com`,
        username: userName,
        password: 'password',
      };
      expect(await authController.Register(registerDto)).toMatchObject(result);
    });
  });

  describe('userLogin', () => {
    it('should success login', async () => {
      const userName = 'user' + Math.floor(Math.random() * 1000 + 1);
      const serviceResult: LoginResponse = {
        accessToken: 'xxx',
      };

      const result: ResponseFormat = {
        success: true,
        message: 'Success login',
        statusCode: HttpStatus.OK,
        data: serviceResult,
      };
      jest
        .spyOn(loginService, 'userLogin')
        .mockImplementation(async () => serviceResult);

      const loginDto: LoginDto = {
        identity: `${userName}@mail.com`,
        password: 'password',
      };
      expect(await authController.Login(loginDto)).toMatchObject(result);
    });
  });
});
