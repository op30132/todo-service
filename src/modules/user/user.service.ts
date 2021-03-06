import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDTO } from '../auth/dto/auth.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findById(id: string): Promise<UserDocument> {
    const res = await this.userModel.findById(id);
    return res || null;
  }

  async findOne(query): Promise<UserDocument> {
    const res = await this.userModel.findOne(query).select('+password');
    return res || null;
  }

  async findByQuery(query): Promise<UserDocument[]> {
    const res = await this.userModel.find(query);
    return res || [];
  }

  async create(userDTO: RegisterDTO): Promise<UserDocument> {
    const { email } = userDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return this.userModel.create(userDTO);
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }

}