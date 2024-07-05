import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from 'src/jwt/jwt.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UtilsService } from 'src/utils/utils.service';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly PrimsmaDB: PrismaService,
    private readonly JwtS: JwtService,
  ) {}

  // 查询所有用户
  async queryAllUser(queryUsers: FindUserDto) {
    try {
      const filterQuery = UtilsService.filterObject(queryUsers);
      return await this.PrimsmaDB.user.findMany({
        where: { ...filterQuery },
        select: {
          id: true,
          account: true,
          username: true,
          email: true,
          auth: true,
          status: true,
          password: false,
          book: false,
        },
      });
    } catch (error) {
      console.log(error);

      throw new HttpException('查询所有用户失败 Service', 500);
    }
  }

  // 注册用户
  async create(
    createUserDto: CreateUserDto,
    sessionCode: string,
    auth: number,
  ) {
    try {
      if (auth !== -1) {
        // noSuper Check
        // 验证码
        if (
          !sessionCode ||
          createUserDto.code.toLocaleLowerCase() !==
            sessionCode.toLocaleLowerCase()
        ) {
          return {
            code: 0,
            message: '验证码错误',
          };
        }

        // 密码一致性
        if (createUserDto.password !== createUserDto.enterPassword) {
          return {
            code: 0,
            message: '两次密码不一致',
          };
        }
      }

      // 账号使用情况
      const checkResult = await this.PrimsmaDB.user.findMany({
        where: {
          account: createUserDto.account,
        },
      });
      if (checkResult.length >= 1) {
        return {
          code: 0,
          message: '此账号已被使用',
        };
      }
      const regResult = await this.PrimsmaDB.user.createMany({
        data: {
          account: createUserDto.account,
          password: createUserDto.password,
          auth: createUserDto.auth,
        },
      });
      if (!regResult) {
        return {
          code: 0,
          message: '注册失败',
        };
      }
      return {
        message: '注册成功',
      };
    } catch (error) {
      throw new HttpException('注册失败 Service', 500);
    }
  }

  // 登录验证
  async login(loginUserDto: LoginUserDto, sessionCode: string) {
    try {
      let Icode = sessionCode;
      const { account, password, code } = loginUserDto;
      if (!Icode) {
        Icode = '0';
      }
      // 检查验证码
      if (Icode.toLocaleLowerCase() !== code.toLocaleLowerCase()) {
        return {
          code: 0,
          message: '验证码错误',
        };
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
          book: false,
        },
      });
      if (userInfo.length !== 1) {
        return {
          code: 0,
          message: '账号或密码错误',
        };
      }
      return {
        message: '登录成功',
        data: {
          userInfo: userInfo[0],
          token: this.JwtS.createJWT(userInfo[0]),
        },
      };
    } catch (error) {
      throw new HttpException('登陆失败 Service', 500);
    }
  }

  // 查询用户
  async queryUser(userId: number) {
    try {
      const userInfo = await this.PrimsmaDB.user.findFirst({
        where: {
          id: userId,
        },
      });
      delete userInfo.password;
      return userInfo;
    } catch (error) {
      throw new HttpException('', 500);
    }
  }

  // 更新用户
  async updateUser(updateUser: UpdateUserDto) {
    try {
      const filterQuery = UtilsService.filterObject(updateUser);
      return await this.PrimsmaDB.user.update({
        where: {
          id: updateUser.id,
        },
        data: {
          ...filterQuery,
        },
      });
    } catch (error) {
      throw new HttpException('', 500);
    }
  }
}
