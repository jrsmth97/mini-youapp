import { Test } from '@nestjs/testing';
import { ResponseFormat } from '../../global/interfaces/response-format.interface';
import {
  IUserInterest,
  IUserProfile,
} from '../../users/interfaces/user.interface';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserInterest, UserProfile } from '../../users/models/user.model';
import { HttpStatus } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserProfileDto } from '../dto/user-profile.dto';
import { createRequest, MockRequest } from 'node-mocks-http';
import { Request } from 'express';
import { UserInterestDto } from '../dto/user-interest.dto';
import { v4 as uuidv4 } from 'uuid';

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NzNkNjA4OC00NGQzLTRlNmMtYmIwMS1lOTRmMTM2ZWVjNTMiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsImlhdCI6MTY5MjUxNzU3MSwiZXhwIjo2MDAxNjkyNTE3NTExfQ.Ue3YXfWTs9T_v6LohSXlYBQOHWwIi9b2dDoQTlA2j-0';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let request: MockRequest<Request>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: getModelToken('User'),
          useValue: User,
        },
        {
          provide: getModelToken('UserProfile'),
          useValue: UserProfile,
        },
        {
          provide: getModelToken('UserInterest'),
          useValue: UserInterest,
        },
        UserService,
      ],
      exports: [UserService],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = new UserController(userService);
  });

  describe('Create Profile', () => {
    it('should success create profile', async () => {
      const userName = 'user' + Math.floor(Math.random() * 1000 + 1);
      const serviceResult: IUserProfile = {
        userId: '',
        displayName: `User ${userName}`,
        gender: 'Male',
        birthday: '1999-01-02',
        profileImage: '',
        horoscope: '',
        zodiac: '',
        height: {
          value: 177,
          unit: 'cm',
        },
        weight: {
          value: 64,
          unit: 'kg',
        },
      };

      const result: ResponseFormat = {
        success: true,
        message: 'Success create user profile',
        statusCode: HttpStatus.CREATED,
        data: serviceResult,
      };
      jest
        .spyOn(userService, 'createProfile')
        .mockImplementation(async () => serviceResult);

      request = createRequest({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userProfileDto: UserProfileDto = {
        displayName: `User ${userName}`,
        gender: 'Male',
        birthday: '1999-01-02',
        profileImage: '',
        horoscope: '',
        zodiac: '',
        height: {
          value: 177,
          unit: 'cm',
        },
        weight: {
          value: 64,
          unit: 'kg',
        },
      };
      expect(
        await userController.CreateProfile(request, userProfileDto),
      ).toMatchObject(result);
    });
  });

  describe('Get Profile', () => {
    it('should success get profile', async () => {
      const userName = 'user' + Math.floor(Math.random() * 1000 + 1);
      const serviceResult: IUserProfile = {
        userId: 'xxx',
        displayName: `User ${userName}`,
        gender: 'Male',
        birthday: '1999-01-02',
        profileImage: 'xxx.jpg',
        horoscope: 'Capricorn',
        zodiac: 'Fish',
        height: {
          value: 177,
          unit: 'cm',
        },
        weight: {
          value: 64,
          unit: 'kg',
        },
        interests: ['Sport', 'Music'],
      };

      const result: ResponseFormat = {
        success: true,
        message: 'Success get user profile',
        statusCode: HttpStatus.OK,
        data: serviceResult,
      };
      jest
        .spyOn(userService, 'getProfile')
        .mockImplementation(async () => serviceResult);

      request = createRequest({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(await userController.GetProfile(request)).toMatchObject(result);
    });
  });

  describe('Update Profile', () => {
    it('should success update profile', async () => {
      const userName = 'user' + Math.floor(Math.random() * 1000 + 1);
      const serviceResult: IUserProfile = {
        userId: 'xxx',
        displayName: `User Updated ${userName}`,
        gender: 'Male',
        birthday: '1999-01-02',
        profileImage: 'xxx.jpg',
        horoscope: 'Capricorn',
        zodiac: 'Fish',
        height: {
          value: 177,
          unit: 'cm',
        },
        weight: {
          value: 64,
          unit: 'kg',
        },
        interests: ['Sport', 'Music'],
      };

      const result: ResponseFormat = {
        success: true,
        message: 'Success update user profile',
        statusCode: HttpStatus.OK,
        data: serviceResult,
      };
      jest
        .spyOn(userService, 'updateProfile')
        .mockImplementation(async () => serviceResult);

      request = createRequest({
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userProfileDto: UserProfileDto = {
        displayName: `User Updated ${userName}`,
        gender: 'Male',
        birthday: '1999-01-02',
        profileImage: 'xxx.jpg',
        horoscope: 'Capricorn',
        zodiac: 'Fish',
        height: {
          value: 177,
          unit: 'cm',
        },
        weight: {
          value: 64,
          unit: 'kg',
        },
      };

      const actual = await userController.UpdateProfile(
        request,
        userProfileDto,
      );
      expect(actual).toMatchObject(result);
      expect(JSON.stringify(actual.data)).toMatch(/Updated/);
    });
  });

  describe('Update Interest', () => {
    it('should success update interest', async () => {
      const serviceResult: IUserInterest = {
        userId: 'xxx',
        interests: ['Sport', 'Music'],
      };

      const result: ResponseFormat = {
        success: true,
        message: 'Success update user interest',
        statusCode: HttpStatus.OK,
        data: serviceResult,
      };
      jest
        .spyOn(userService, 'updateInterest')
        .mockImplementation(async () => serviceResult);

      request = createRequest({
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userInterestDto: UserInterestDto = {
        interests: ['Sport', 'Music'],
      };

      const actual = await userController.UpdateUserInterest(
        request,
        userInterestDto,
      );
      expect(actual).toMatchObject(result);
      expect(JSON.stringify(actual.data)).toMatch(/Music/);
    });
  });

  describe('Get Horoscope', () => {
    it('should success get horoscope', async () => {
      const result: ResponseFormat = {
        success: true,
        message: 'Success get horoscope',
        statusCode: HttpStatus.OK,
        data: 'Capricorn',
      };

      const date = '1999-01-02';
      const actual = await userController.GetHoroscope(date);
      expect(actual).toMatchObject(result);
      expect(actual.data).toMatch(/Capricorn/);
    });
  });

  describe('Get Zodiac', () => {
    it('should success get zodiac', async () => {
      const result: ResponseFormat = {
        success: true,
        message: 'Success get zodiac',
        statusCode: HttpStatus.OK,
        data: 'Rabbit',
      };

      const date = '1999-03-02';
      const actual = await userController.GetZodiac(date);
      expect(actual).toMatchObject(result);
      expect(actual.data).toMatch(/Rabbit/);
    });
  });

  describe('Upload Profile Image', () => {
    it('should success upload profile image', async () => {
      const serviceResult: IUserProfile = {
        userId: 'xxx',
        displayName: `User XXX`,
        gender: 'Male',
        birthday: '1999-01-02',
        profileImage: 'xxx.jpg',
        horoscope: 'Capricorn',
        zodiac: 'Fish',
        height: {
          value: 177,
          unit: 'cm',
        },
        weight: {
          value: 64,
          unit: 'kg',
        },
        interests: ['Sport', 'Music'],
      };

      const imageFiles: any = [];
      const timeStamp = new Date().getTime();
      const imgId = uuidv4();
      const fileName = `${imgId}_${timeStamp}.png`;
      imageFiles.push({
        fieldname: 'file',
        originalname: 'mock-user.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: './storage/uploads',
        filename: fileName,
        path: 'storage/uploads/' + fileName,
        size: 21389,
      });

      const result: ResponseFormat = {
        success: true,
        message: 'Success upload profile image',
        statusCode: HttpStatus.CREATED,
        data: fileName,
      };

      request = createRequest({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      jest
        .spyOn(userService, 'getProfile')
        .mockImplementation(async () => serviceResult);

      const actual = await userController.UploadProfileImage(
        request,
        imageFiles,
      );

      expect(actual).toMatchObject(result);
      expect(actual.data).toMatch(fileName);
    });
  });
});
