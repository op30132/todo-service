import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Project } from 'src/modules/project/schemas/project.schema';
import { User } from 'src/modules/user/schemas/user.schema';
import { Document } from 'mongoose';
import schemaOptions from 'src/shared/schema-option';


export type ListDocument = List & Document;

@Schema(schemaOptions)
export class List {
  @Prop({ type: String })
  title: string;
  

  @Prop({ type: Types.ObjectId, ref: Project.name })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  creator: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Number })
  pos: number;
}

let ListSchema = SchemaFactory.createForClass(List);

ListSchema.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'listId', 
  justOne: false,
  options: { sort: { pos: 1 }}
});
export {ListSchema};