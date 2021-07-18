import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
import { Document } from 'mongoose';
import { List } from 'src/modules/list/schemas/list.schema';
import schemaOptions from 'src/shared/schema-option';

export type TodoDocument = Todo & Document;

@Schema(schemaOptions)
export class Todo {
  @Prop({ type: String, trim: true })
  title: string;

  @Prop()
  content: String;

  @Prop()
  dueDate: Date;

  @Prop({ type: Boolean, default: false })
  isImportant: Boolean;

  @Prop({ type: Boolean, default: false })
  isComplete: Boolean;

  @Prop({ type: Types.ObjectId, ref: List.name })
  listId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  creator: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Number })
  pos: number;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);