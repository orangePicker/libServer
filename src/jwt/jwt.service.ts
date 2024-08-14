import { HttpException, Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserDto } from 'src/user/dto/user.dto';
import { config } from 'dotenv';

@Injectable()
export class JwtService {
  private secret = config().parsed.SECRET_JWT;
  constructor() {}
  public createJWT(userInfo: UserDto) {
    return jwt.sign(userInfo, this.secret, { expiresIn: '1h' });
  }

  static checkJwt(req: Request, res: Response, next: NextFunction) {
    // console.log('check JWT');

    const witheUrl = ['/user/login', '/util/getCode'];
    const url = new URL(`http://${req.hostname}:8000${req.url}`);
    if (witheUrl.includes(url.pathname)) {
      return next();
    }
    try {
      const token = req.header('token');
      if (!token) {
        throw new Error('no token');
      }

      const userJwt: any = jwt.verify(token, config().parsed.SECRET_JWT);

      if (!Object.keys(userJwt).length) {
        throw new Error('bad token');
      }
      if (Date.now() / 1000 > userJwt.exp) {
        throw new Error('token timesout');
      }
      req.user = userJwt;

      next();
    } catch (error) {
      next(new HttpException('token失效或已过期', 401));
    }
  }
}
