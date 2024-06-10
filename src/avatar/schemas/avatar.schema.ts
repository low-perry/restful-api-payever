import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Avatar extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  imageData: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
