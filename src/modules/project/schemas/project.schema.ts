import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: String;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  coworker: String[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

