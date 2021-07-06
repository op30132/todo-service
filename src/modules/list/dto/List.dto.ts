import { IsNotEmpty } from 'class-validator';

export class ListDTO {
  @IsNotEmpty({ message: '標題不可為空值' })
  title: string;

  @IsNotEmpty({ message: 'projectId 不可為空值' })
  projectId: string;

  pos: number;
}

export class ListUpdateDTO {
  title: string;
  projectId: string;
  pos: number;
}
