export class UpdateUserDto {
  id: number;
  password?: string;
  username?: string;
  email?: string;
  auth?: number;
  status?: string;
}
