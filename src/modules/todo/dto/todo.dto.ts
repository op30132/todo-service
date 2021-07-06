import { IsNotEmpty } from 'class-validator';

export class TodoDTO {
  @IsNotEmpty({ message: '標題不可為空值' })
  title: string;

  content: string;

  @IsNotEmpty({ message: 'listId 不可為空值' })
  listId: string;

  dueDate: Date;

  isImportant: Boolean;

  isComplete: Boolean;

  pos: number;
}

export class TodoUpdateDTO {
  title: string;
  content: string;
  listId: string;
  dueDate: Date;
  isImportant: Boolean;
  isComplete: Boolean;
  pos: number;
}
