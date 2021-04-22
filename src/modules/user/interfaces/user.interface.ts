import { Document } from 'mongoose';

export interface User extends Document {
  _id?: string;
  username?: string;
  account?: string;
  readonly password?: string;
  created?: Date;
}
