import {
  Controller,
  Post as PostMapping,
  Body,
  Session,
  UseInterceptors,
  BadRequestException,
  Req,
  HttpException,
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
      return await this.userService.create(
        createUserDto,
        session.code as string,
        req.user.auth,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // 登录
  @PostMapping('login')
  async login(@Body() loginUserDto: LoginUserDto, @Session() session) {
    return await this.userService.login(loginUserDto, session.code as string);
  }

  // 查询用户信息
  @PostMapping('queryUser')
  async queryUser(@Req() req: Request) {
    try {
      const data = await this.userService.queryUser(req.user.id);
      if (!data) {
        return {
          code: 0,
          message: '用户不存在',
        };
      }
      return {
        message: '查询成功',
        data,
      };
    } catch (error) {
      throw new HttpException('', 500);
    }
  }

  // 查询所有用户信息
  @PostMapping('queryAllUser')
  async queryAllUser(@Body() body: FindUserDto) {
    try {
      const result = await this.userService.queryAllUser(body);
      return {
        message: '查询成功',
        data: {
          users: result,
          total: result.length || 0,
        },
      };
    } catch (error) {
      throw new HttpException('', 500);
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
      const result = await this.userService.updateUser(userData);
      if (!result) {
        return {
          code: 0,
          message: '更新用户失败',
        };
      }
      return {
        data: null,
        message: '修改成功',
      };
    } catch (error) {
      throw new HttpException('', 500);
    }
  }
}
