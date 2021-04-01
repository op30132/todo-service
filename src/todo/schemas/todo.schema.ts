import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Todo {
  @Prop()
  title: string;

  @Prop()
  content: String;

  @Prop()
  date: Date;

  @Prop()
  important: Boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);