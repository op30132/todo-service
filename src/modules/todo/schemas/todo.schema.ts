import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Project } from 'src/modules/project/schemas/project.schema';
import { User } from 'src/modules/user/schemas/user.schema';

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

  @Prop({ type: [Types.ObjectId], ref: Project.name })
  project: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  creator: Types.ObjectId;

}

export const TodoSchema = SchemaFactory.createForClass(Todo);