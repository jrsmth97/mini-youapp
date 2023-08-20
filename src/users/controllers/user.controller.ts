import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Req,
  Put,
  Get,
  UseInterceptors,
  UploadedFiles,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseFormat } from '../../global/interfaces/response-format.interface';
import { ResponseBuilder } from '../../global/utils/response-builder.util';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserService } from '../services/user.service';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileOptions } from '../../global/utils/file-options.util';
import { UserInterestDto } from '../dto/user-interest.dto';
import { getHoroscope, getZodiac } from '../../global/helpers/user.helper';
import { existsSync, unlinkSync } from 'fs';

@Controller('')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createProfile')
  public async CreateProfile(
    @Req() req: Request,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<ResponseFormat> {
    const newUserProfile = await this.userService.createProfile(
      req,
      userProfileDto,
    );
    return ResponseBuilder.SuccessResponse(
      'Success create user profile',
      HttpStatus.CREATED,
      newUserProfile,
    );
  }

  @Get('getProfile')
  public async GetProfile(@Req() req: Request): Promise<ResponseFormat> {
    const userProfile = await this.userService.getProfile(req);
    return ResponseBuilder.SuccessResponse(
      'Success get user profile',
      HttpStatus.OK,
      userProfile,
    );
  }

  @Put('updateProfile')
  public async UpdateProfile(
    @Req() req: Request,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<ResponseFormat> {
    const userProfileUpdated = await this.userService.updateProfile(
      req,
      userProfileDto,
    );
    return ResponseBuilder.SuccessResponse(
      'Success update user profile',
      HttpStatus.OK,
      userProfileUpdated,
    );
  }

  @Put('updateInterest')
  public async UpdateUserInterest(
    @Req() req: Request,
    @Body() userInterestDto: UserInterestDto,
  ): Promise<ResponseFormat> {
    const userInterestUpdated = await this.userService.updateInterest(
      req,
      userInterestDto,
    );
    return ResponseBuilder.SuccessResponse(
      'Success update user interest',
      HttpStatus.OK,
      userInterestUpdated,
    );
  }

  @Get('getHoroscope')
  @ApiQuery({
    name: 'date',
    description: 'format {yyyy-mm-dd}',
  })
  public async GetHoroscope(
    @Query('date') date: string,
  ): Promise<ResponseFormat> {
    if (!date) throw new BadRequestException('date required');
    const horoscope = getHoroscope(date);
    return ResponseBuilder.SuccessResponse(
      'Success get horoscope',
      HttpStatus.OK,
      horoscope,
    );
  }

  @Get('getZodiac')
  @ApiQuery({
    name: 'date',
    description: 'format {yyyy-mm-dd}',
  })
  public async GetZodiac(@Query('date') date: string): Promise<ResponseFormat> {
    if (!date) throw new BadRequestException('date required');
    const horoscope = getZodiac(date);
    return ResponseBuilder.SuccessResponse(
      'Success get zodiac',
      HttpStatus.OK,
      horoscope,
    );
  }

  @Post('uploadProfileImage')
  @UseInterceptors(FilesInterceptor('file', 1, FileOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async UploadProfileImage(
    @Req() req: Request,
    @UploadedFiles() files: any,
  ): Promise<ResponseFormat> {
    const fileUpload = files[0].filename;
    const currentProfile = await this.userService.getProfile(req);
    if (
      currentProfile.profileImage &&
      existsSync('storage/uploads/' + currentProfile.profileImage)
    ) {
      unlinkSync('storage/uploads/' + currentProfile.profileImage);
    }

    return ResponseBuilder.SuccessResponse(
      'Success upload profile image',
      HttpStatus.CREATED,
      fileUpload,
    );
  }
}
