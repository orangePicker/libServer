import {
  Controller,
  Post as PostMapping,
  Body,
  Session,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SuccessReaponse } from 'src/interceptor/successResponse';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('user')
@UseInterceptors(new SuccessReaponse())
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 注册用户
  @PostMapping('register')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Session() session,
    @Req() req: Request,
  ) {
    try {
      const code = session.code;
      // 销毁session
      session.destroy && session.destroy();
      const { message, success } = await this.userService.create(
        createUserDto,
        code as string,
        req.user?.auth,
      );

      return success ? { message } : { message, code: 0 };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 登录
  @PostMapping('login')
  async login(@Body() loginUserDto: LoginUserDto, @Session() session) {
    try {
      const code = session?.code;
      // 销毁session
      session.destroy && session.destroy();
      const { message, success, data } = await this.userService.login(
        loginUserDto,
        code as string,
      );
      return success ? { message, data } : { message };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 查询用户信息
  @PostMapping('queryUser')
  async queryUser(@Req() req: Request) {
    try {
      const { message, success, data } = await this.userService.queryUser(
        req.user.id,
      );

      return success ? { message, data } : { message, code: 0 };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 查询所有用户信息
  @PostMapping('queryAllUser')
  async queryAllUser(@Body() body: FindUserDto) {
    try {
      const { message, data } = await this.userService.queryAllUser(body);
      return {
        message,
        data: {
          users: data,
          total: data.length || 0,
        },
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 更新用户信息
  @PostMapping('updateUser')
  async updateUser(@Req() req: Request, @Body() body: UpdateUserDto) {
    try {
      let id = req.user.id;
      if (req.user.auth === -1) {
        id = body.id;
      }
      const userData: UpdateUserDto = {
        ...body,
        id,
      };
      const { message, success } = await this.userService.updateUser(userData);

      return success ? { message } : { message, code: 0 };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
