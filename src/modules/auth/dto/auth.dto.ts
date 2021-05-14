import { IsNotEmpty } from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export interface RegisterDTO {
  email: string;
  username: string;
  googleId?: string;
  password?: string;
}
