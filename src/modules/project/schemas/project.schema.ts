import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';

@Schema()
export class Project {
  @Prop()
  name: string;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  owner: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  coworker: User[];
}

export const TodoSchema = SchemaFactory.createForClass(Project);