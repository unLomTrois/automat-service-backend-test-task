import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.service.findAll();
  }

  @Patch(':username')
  async update(
    @Param('username') old_username: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.service.update(old_username, dto);
  }

  @Delete(':username')
  async delete(@Param('username') username: string): Promise<User> {
    return this.service.delete(username);
  }
}
