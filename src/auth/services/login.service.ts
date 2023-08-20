import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/interfaces/user.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { LoginDto } from '../dto/login.dto';
import { TokenPayload } from 'src/global/interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel('User') private readonly user: Model<IUser>,
    private readonly jwtService: JwtService,
  ) {}

  public async userLogin(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.user
      .findOne({})
      .or([{ email: loginDto.identity }, { username: loginDto.identity }]);
    if (!user) throw new ForbiddenException('Please check your credentials');
    const pass = await bcrypt.compare(loginDto.password, user.password);
    if (!pass) throw new ForbiddenException('Please check your credentials');

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = await this.generateToken(payload);
    return { accessToken: token };
  }

  public async generateToken(payload: TokenPayload): Promise<string> {
    const ttl = process.env.JWT_TTL;
    const accessToken = this.jwtService.sign(payload, { expiresIn: ttl });
    return accessToken;
  }
}
