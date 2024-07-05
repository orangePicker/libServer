export class CreateUserDto {
  account: string;
  password: string;
  enterPassword: string;
  username?: string;
  email?: string;
  auth?: number;
  code: string;
}
