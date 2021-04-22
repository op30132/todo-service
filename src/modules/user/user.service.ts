import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO, RegisterDTO } from '../auth/dto/auth.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) { }

  async findOne(query): Promise<User | undefined> {
    const res = await this.userModel.findOne(query);
    if (!res) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return res;
  }

  async create(userDTO: RegisterDTO) {
    const { account } = userDTO;
    const user = await this.userModel.findOne({ account });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(userDTO);
    await createdUser.save();
    return createdUser;
  }

  async findAll() {
    return await this.userModel.find();
  }
}