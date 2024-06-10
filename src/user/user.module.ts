import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AvatarModule } from 'src/avatar/avatar.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AvatarModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
