import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarSchema } from './schemas/avatar.schema';
import { AvatarService } from './avatar.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Avatar', schema: AvatarSchema }]),
  ],
  controllers: [],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
