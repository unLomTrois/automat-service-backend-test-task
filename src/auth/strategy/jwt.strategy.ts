import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): any => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    username: string;
  }): Promise<Omit<User, 'password'>> {
    const { username } = payload;
    try {
      const user = await this.userService.findOneByUsername(username, true);
      user.password = undefined;
      return { username: user.username, _id: user._id };
    } catch (error) {
      if (error?.message) {
        throw error;
      }
      throw new HttpException(
        'Непредвиденная ошибка с токеном',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
