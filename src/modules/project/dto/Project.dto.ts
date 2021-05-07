import { IsNotEmpty } from 'class-validator';

export class ProjectDTO {
  @IsNotEmpty({ message: '名稱不可為空值' })
  name: string;
}

export class CoworkerDTO {
  @IsNotEmpty({ message: 'no userId' })
  userId: string;
}