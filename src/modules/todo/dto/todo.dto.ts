import { IsNotEmpty } from 'class-validator';

export class TodoDTO {
  @IsNotEmpty({ message: '標題不可為空值' })
  title: string;

  @IsNotEmpty({ message: '內容不可為空值' })
  content: string;

  date: Date;

  important: Boolean;
}