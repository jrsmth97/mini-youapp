import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { RegisterService } from './services/register.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/models/user.model';
import { LoginService } from './services/login.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: User,
        collection: 'users',
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [RegisterService, LoginService],
  exports: [RegisterService, LoginService],
})
export class AuthModule {}
