import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from 'src/jwt/jwt.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { filterObject, serviceReturn } from 'src/utils/utils';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly PrimsmaDB: PrismaService,
    private readonly JwtS: JwtService,
  ) {}

  // 查询所有用户
  async queryAllUser(queryUsers: FindUserDto) {
      const filterQuery = filterObject(queryUsers);
      const users = await this.PrimsmaDB.user.findMany({
        where: { ...filterQuery },
        select: {
          id: true,
          account: true,
          username: true,
          email: true,
          auth: true,
          status: true,
          password: false,
          book_book_userTouser: false,
        },
      });
      return serviceReturn('查询成功',true,users)
  }

  // 注册用户
  async create(
    createUserDto: CreateUserDto,
    sessionCode: string,
    auth: number,
  ) {
      if (auth !== -1) {
        // noSuper Check
        // 验证码
        if (
          !sessionCode ||
          createUserDto.code.toLocaleLowerCase() !==
            sessionCode.toLocaleLowerCase()
        ) {
          return serviceReturn('验证码错误')
        }

        // 密码一致性
        if (createUserDto.password !== createUserDto.enterPassword) {
          return serviceReturn('两次密码不一致')
        }
      }

      // 账号使用情况
      const checkResult = await this.PrimsmaDB.user.findMany({
        where: {
          account: createUserDto.account,
        },
      });
      if (checkResult.length >= 1) {
        return serviceReturn('此账号已被使用');
      }
      const regResult = await this.PrimsmaDB.user.createMany({
        data: {
          account: createUserDto.account,
          password: createUserDto.password,
          auth: createUserDto.auth,
        },
      });
      if (!regResult) {
        return serviceReturn('注册失败');
      }
      return serviceReturn('注册成功',true)
  }

  // 登录验证
  async login(loginUserDto: LoginUserDto, sessionCode: string) {
      let Icode = sessionCode;
      const { account, password, code } = loginUserDto;
      if (!Icode) {
        Icode = '0';
      }
      // 检查验证码
      if (Icode.toLocaleLowerCase() !== code.toLocaleLowerCase()) {
        return serviceReturn('验证码错误')
      }

      // 验证账号和密码
      const userInfo = await this.PrimsmaDB.user.findMany({
        where: {
          account,
          password,
        },
        select: {
          id: true,
          account: true,
          username: true,
          email: true,
          auth: true,
          status: true,
          password: false,
        },
      });
      if (userInfo.length !== 1) {
        return serviceReturn('账号或密码错误')
      }

      const data = {
        userInfo: userInfo[0],
        token: this.JwtS.createJWT(userInfo[0]),
      }
      return serviceReturn('登录成功',true,data)
  }

  // 查询用户
  async queryUser(userId: number) {
      const userInfo = await this.PrimsmaDB.user.findFirst({
        where: {
          id: userId,
        },
      });
      delete userInfo.password;
      return userInfo ? serviceReturn('查询成功',true,userInfo) : serviceReturn('用户不存在');
  }

  // 更新用户
  async updateUser(updateUser: UpdateUserDto) {
      const filterQuery = filterObject(updateUser);
      const result = await this.PrimsmaDB.user.update({
        where: {
          id: updateUser.id,
        },
        data: {
          ...filterQuery,
        },
      });
      return result ? serviceReturn('修改成功',true) : serviceReturn('修改失败')
  }
}
