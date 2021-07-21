import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import schemaOptions from 'src/shared/schema-option';

export type UserDocument = User & Document;

@Schema(schemaOptions)
export class User {
  @Prop({ required: true, unique: true, allowNull: false })
  email: string;

  @Prop({ select: false, allowNull: true })
  password: string;

  @Prop({ required: true, allowNull: false })
  username: string;

  @Prop({ type: Date, default: Date.now, allowNull: false })
  createdAt: Date;

  @Prop({ type: String, allowNull: false })
  googleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});