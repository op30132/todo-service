import { IsNotEmpty } from 'class-validator';

export class ProjectDTO {
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}

export class CoworkerDTO {
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;
}