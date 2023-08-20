import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from '../dto/register.dto';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class RegisterService {
  constructor(@InjectModel('User') private readonly user: Model<IUser>) {}

  public async userRegister(registerDto: RegisterDto): Promise<IUser> {
    const countDuplicateEmail = await this.user.count({
      email: registerDto.email,
    });
    if (countDuplicateEmail > 0)
      throw new BadRequestException('email has been used');

    const countDuplicateUsername = await this.user.count({
      email: registerDto.username,
    });
    if (countDuplicateUsername > 0)
      throw new BadRequestException('username has been used');

    const salt = await bcrypt.genSalt(11);
    registerDto.password = await bcrypt.hash(registerDto.password, salt);
    const newUser = await this.user.create(registerDto);
    newUser.save().catch((err) => {
      throw new InternalServerErrorException(err);
    });

    return newUser;
  }
}
