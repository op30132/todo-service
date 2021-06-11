import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Project } from 'src/modules/project/schemas/project.schema';
import { User } from 'src/modules/user/schemas/user.schema';
import { Document } from 'mongoose';

export type ListDocument = List & Document;

@Schema()
export class List {
  @Prop()
  title: string;

  @Prop({ type: Types.ObjectId, ref: Project.name })
  project: String;

  @Prop({ type: Types.ObjectId, ref: User.name })
  creator: String;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ListSchema = SchemaFactory.createForClass(List);