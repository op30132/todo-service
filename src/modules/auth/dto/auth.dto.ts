
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  username: string;
  googleId?: string;
  password?: string;
}
