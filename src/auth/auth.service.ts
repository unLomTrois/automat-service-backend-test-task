import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

type JWTPayload = {
  _id: string;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {}

  /**
   * проверяет, существует ли клиент с такими email, и соответствуют ли его хеш пароля и пароль
   * @throws { NotFoundException }
   * @throws { ForbiddenException }
   * @throws { UnauthorizedException }
   */
  async validateUser(dto: LoginDto): Promise<User> {
    const user = await this.usersService.findOneByUsername(dto.username, true);
    console.log('USER', user);
    await this.verifyPassword(dto.password, user.password);
    return user;
  }

  /**
   * проверяет сырой пароль и его хеш на соответствие
   * @param password - пароль
   * @param hashed_password - хеш пароля
   */
  private async verifyPassword(
    password: string,
    hashed_password: string,
  ): Promise<boolean> {
    // const isPasswordMatching = await bcrypt.compare(password, hashed_password);
    const isPasswordMatching = password === hashed_password;
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Неправильный логин или пароль!');
    }
    return isPasswordMatching;
  }

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
