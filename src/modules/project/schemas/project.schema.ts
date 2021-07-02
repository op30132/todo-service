import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import schemaOptions from 'src/shared/schema-option';

export type ProjectDocument = Project & Document;

@Schema(schemaOptions)
export class Project {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }]})
  coworker: Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}
const ProjectSchema = SchemaFactory.createForClass(Project);
export {ProjectSchema};
