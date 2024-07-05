import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

// interface UserJwt {
//   id: number;
//   account: string;
//   username?: string;
//   email?: string;
//   auth: number;
//   iat: number;
//   exp: number;
// }
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
