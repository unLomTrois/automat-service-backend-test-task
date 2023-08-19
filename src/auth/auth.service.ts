import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

type JWTPayload = {
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * на вход получает роль и почту, делает из этго новый access jwt-токен
   * @param payload почта и роль
   * @returns и возвращает новые куки для ответа и сам access токен
   */
  public getJwtAccessToken(payload: JWTPayload): {
    cookie: string;
    token: string;
  } {
    const token = this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get('JWT_ACCESS_EXPIRATION_TIME')}s`,
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_EXPIRATION_TIME',
    )}`;

    return { cookie, token };
  }

  /**
   * на вход получает роль и почту, делает из этго новый refresh jwt-токен
   * @param payload почта и роль
   * @returns и возвращает новые куки для ответа и сам refresh токен
   */
  public getJwtRefreshToken(payload: JWTPayload): {
    cookie: string;
    token: string;
  } {
    const token = this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_EXPIRATION_TIME',
    )}`;

    return { cookie, token };
  }
}
