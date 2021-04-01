import { Document } from 'mongoose';

export interface TODO extends Document {
  title: String,
  content: String,
  date: Date,
  important: Boolean
}