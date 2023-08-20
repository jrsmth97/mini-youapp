import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './global/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule,
    MediaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'login', method: RequestMethod.POST },
        { path: 'register', method: RequestMethod.POST },
        { path: 'user-genders', method: RequestMethod.GET },
        { path: 'height-units', method: RequestMethod.GET },
        { path: 'weight-units', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
