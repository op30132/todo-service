import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({
    required: [true, 'Token value is required'],
    unique: true,
  })
  value: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  ipAddress: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);