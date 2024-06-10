import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Avatar } from './schemas/avatar.schema';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name) private readonly avatarModel: Model<Avatar>,
  ) {}

  async createAvatar(userId: string, imageData: string): Promise<Avatar> {
    const avatar = new this.avatarModel({ userId, imageData });
    return avatar.save();
  }

  async getAvatarByUserId(userId: string): Promise<Avatar | null | string> {
    const avatar = await this.avatarModel.findOne({ userId });
    const isValidId = mongoose.isValidObjectId(userId);
    if (!isValidId) {
      throw new BadRequestException('Enter correct id');
    }
    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }
    return avatar.imageData;
  }
  async deleteAvatarByUserId(userId: string): Promise<Avatar | null> {
    const avatar = await this.avatarModel.findOneAndDelete({ userId });
    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }
    return avatar;
  }
}
