import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetTodoFilterDTO {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  date: Date;

}