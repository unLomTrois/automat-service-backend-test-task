import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async update(username: string, dto: UpdateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate({ username }, dto, {
      returnDocument: 'after',
    });
  }

  async delete(username: string): Promise<User> {
    return this.userModel.findOneAndDelete({ username });
  }
}
