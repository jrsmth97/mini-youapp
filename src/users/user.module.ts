import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserInterest, UserProfile } from './models/user.model';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: User,
        collection: 'users',
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'UserProfile',
        schema: UserProfile,
        collection: 'user_profiles',
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'UserInterest',
        schema: UserInterest,
        collection: 'user_interests',
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
