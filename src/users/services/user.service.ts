import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  IUser,
  IUserInterest,
  IUserProfile,
} from '../interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UserProfileDto } from '../dto/user-profile.dto';
import { Request } from 'express';
import { UserInterestDto } from '../dto/user-interest.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly user: Model<IUser>,
    @InjectModel('UserProfile')
    private readonly userProfile: Model<IUserProfile>,
    @InjectModel('UserInterest')
    private readonly userInterest: Model<IUserInterest>,
  ) {}

  public async createProfile(
    req: Request,
    userProfileDto: UserProfileDto,
  ): Promise<IUserProfile> {
    const userId = req['user']?.userId;
    const userProfileExist = await this.userProfile.findOne({ userId: userId });
    if (userProfileExist) throw new BadRequestException('user profile exists');

    const newUserProfile = new this.userProfile(userProfileDto);
    newUserProfile.userId = req['user']?.userId;
    await newUserProfile.save().catch((err) => {
      throw new InternalServerErrorException(err);
    });

    return newUserProfile;
  }

  public async getProfile(req: Request): Promise<IUserProfile> {
    const userId = req['user']?.userId;
    const user = await this.user.findOne({ id: userId });
    const userProfile = await this.userProfile.findOne({ userId: userId });
    const userInterest = await this.userInterest.findOne({ userId: userId });
    if (!userProfile) throw new NotFoundException('user profile not exists');
    let interests = [];
    if (userInterest) interests = userInterest.interests;

    const userProfileResponse: IUserProfile = {
      userId: user.id,
      email: user.email,
      username: user.username,
      displayName: userProfile.displayName,
      gender: userProfile.gender,
      birthday: userProfile.birthday,
      height: userProfile.height,
      weight: userProfile.weight,
      zodiac: userProfile.zodiac,
      horoscope: userProfile.horoscope,
      profileImage: userProfile.profileImage,
      interests: interests,
    };

    return userProfileResponse;
  }

  public async updateProfile(
    req: Request,
    userProfileDto: UserProfileDto,
  ): Promise<IUserProfile> {
    const userId = req['user']?.userId;
    const userProfile = await this.userProfile.findOne({ userId: userId });
    if (!userProfile) throw new NotFoundException('user profile not found');

    userProfile.displayName = userProfileDto.displayName;
    userProfile.birthday = userProfileDto.birthday;
    userProfile.gender = userProfileDto.gender;
    userProfile.weight = userProfileDto.weight;
    userProfile.height = userProfileDto.height;
    userProfile.horoscope = userProfileDto.horoscope;
    userProfile.zodiac = userProfileDto.zodiac;
    userProfile.profileImage = userProfileDto.profileImage;
    await this.userProfile
      .updateOne({ userId: userProfile.userId }, userProfile)
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    return userProfile;
  }

  public async updateInterest(
    req: Request,
    userInterestDto: UserInterestDto,
  ): Promise<IUserInterest> {
    const userId = req['user']?.userId;
    await this.userInterest.deleteOne({ userId: userId });
    const userInterest = new this.userInterest(userInterestDto);
    userInterest.userId = userId;
    await userInterest.save().catch((err) => {
      throw new InternalServerErrorException(err);
    });

    return userInterest;
  }

  public async findUserById(id: string): Promise<IUser> {
    return await this.user.findOne({ id });
  }
}
