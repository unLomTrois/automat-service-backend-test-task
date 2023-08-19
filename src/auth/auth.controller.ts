import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Авторизация',
    description:
      'Данный метод логинит клиентов и мастеров. Для работы с приложением нужно залогиниться.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Прежде чем залогиниться, зарегистрируйте пользователя',
    examples: {
      client: {
        summary: 'Клиент',
        description: 'Обыкновенный клиент',
        value: {
          username: 'admin',
          password: 'client',
          role: 'client',
        } as LoginDto,
      },
    },
  })
  @Post('login')
  @ApiOkResponse({
    // type: ClientDto,
    description: 'При входе, в куки записываются токены авторизации',
  })
  @ApiUnauthorizedResponse({ description: 'Неправильный логин или пароль!' })
  @UseGuards(LocalGuard)
  async login(
    @Body() { password, username }: LoginDto,
    @Res({ passthrough: true }) response: Response<any>,
  ): Promise<any> {
    //* тут нет try-catch, потому что логин происходит в паспорт-стратегии

    // const payload = {};

    // const access_token = this.authService.getJwtAccessToken(payload);
    // const refresh_token = this.authService.getJwtRefreshToken(payload);

    // response.setHeader('Set-Cookie', [
    //   access_token.cookie,
    //   refresh_token.cookie,
    // ]);

    // user.password = undefined;

    const user = { username, password };

    return user;
  }
}
