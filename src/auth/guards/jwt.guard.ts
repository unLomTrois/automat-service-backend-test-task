import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: any,
    status: any,
  ): any {
    if (info?.message == 'No auth token') {
      throw new UnauthorizedException('No auth token');
    }
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Expired Token');
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid Token');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
