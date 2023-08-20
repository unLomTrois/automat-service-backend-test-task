import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from 'src/user/schemas/user.schema';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('AUTH')
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
      admin: {
        summary: 'admin',
        description: 'admin',
        value: {
          username: 'admin',
          password: 'admin',
        } as LoginDto,
      },
    },
  })
  @Post('login')
  @ApiOkResponse({
    type: User,
    description: 'При входе, в куки записываются токены авторизации',
  })
  @ApiUnauthorizedResponse({ description: 'Неправильный логин или пароль!' })
  async login(
    @Body() { password, username }: LoginDto,
    @Res({ passthrough: true }) response: Response<any>,
  ): Promise<any> {
    console.log(password, username);
    const user = await this.authService.validateUser({
      username,
      password,
    });

    const payload = { _id: user._id, username: user.username };

    const access_token = this.authService.getJwtAccessToken(payload);
    const refresh_token = this.authService.getJwtRefreshToken(payload);

    response.setHeader('Set-Cookie', [
      access_token.cookie,
      refresh_token.cookie,
    ]);

    return payload;
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async Me(@Req() req: Request & { user: User }): Promise<User> {
    const { user } = req;

    console.log(user);

    return user;
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ description: 'Успешный выход' })
  Logout(@Res({ passthrough: true }) response: Response<any>): string {
    response.setHeader('Set-Cookie', [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ]);

    return 'Успешный выход';
  }
}
