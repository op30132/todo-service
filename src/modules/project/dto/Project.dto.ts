import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ProjectDTO {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty({ message: 'name is required' })
  readonly name: string;
}

export class CoworkerDTO {
  @IsString()
  @IsNotEmpty({ message: 'userId is required' })
  readonly userId: string;
}

export class InviteCoworkerDTO {
  @IsNotEmpty({ message: 'userId is required' })
  readonly userId: string;
}