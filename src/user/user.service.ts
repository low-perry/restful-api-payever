import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    // Inject the User model
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.userModel.create(user);
    return createdUser.save();
  }

  async findbyId(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatebyId(id: string, user: User): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async deletebyId(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}
