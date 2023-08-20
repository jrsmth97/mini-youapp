import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException();
    const bearer = (authHeader as string).split(' ');
    if (bearer[0] !== 'Bearer' || !bearer[1]) throw new UnauthorizedException();
    const token = bearer[1];
    const decode: TokenPayload = await this.jwtService
      .verifyAsync(token, { secret: process.env.JWT_SECRET })
      .catch((err) => {
        const message =
          err.name == 'TokenExpiredError' ? 'Token expired' : err.message;
        throw new UnauthorizedException(message);
      });

    req['user'] = decode;
    next();
  }
}
