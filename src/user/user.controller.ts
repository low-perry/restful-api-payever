import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-book.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AvatarService } from 'src/avatar/avatar.service';
import * as fs from 'fs';

@Controller('api/users')
export class UserController {
  SERVER_URL: string = 'http://localhost:3000/';
  constructor(
    private userService: UserService,
    private avatarService: AvatarService,
  ) {}

  @Get()
  async getAllUsers(@Query() query: ExpressQuery): Promise<User[]> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.findbyId(id);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updatebyId(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deletebyId(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: (req, file, cb) => {
          const fileName =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file,
  ): Promise<User> {
    const buffer = fs.readFileSync(file.path);
    const avatarBase64 = Buffer.from(buffer).toString('base64');
    await this.avatarService.createAvatar(id, avatarBase64);
    return this.userService.setAvatar(id, file.filename);
  }

  @Get(':id/avatar')
  async serveAvatar(@Param('id') id: string): Promise<any> {
    return await this.avatarService.getAvatarByUserId(id);
  }
  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findbyId(id);
    const path = `./avatars/${user.avatar}`;
    fs.unlinkSync(path);
    await this.avatarService.deleteAvatarByUserId(id);
    return this.userService.setAvatar(id, '');
  }
}
