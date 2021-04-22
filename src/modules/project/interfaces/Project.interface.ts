import { Document } from 'mongoose';

export interface PROJECT extends Document {
  name?: string;
  owner?: string;
  coworker?: string[];
}