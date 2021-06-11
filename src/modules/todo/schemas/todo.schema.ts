import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
import { Document } from 'mongoose';
import { List } from 'src/modules/list/schemas/list.schema';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop()
  title: string;

  @Prop()
  content: String;

  @Prop()
  dueDate: Date;

  @Prop()
  important: Boolean;

  @Prop({ type: Types.ObjectId, ref: List.name })
  list: String;

  @Prop({ type: Types.ObjectId, ref: User.name })
  creator: String;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);