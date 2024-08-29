import { HttpException, Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtWhite } from 'src/config/config';
import { UserDto } from 'src/user/dto/user.dto';
import { myEnv } from 'src/utils/utils';

@Injectable()
export class JwtService {
  private secret = myEnv.SECRET_JWT;
  constructor() {}
  public createJWT(userInfo: UserDto) {
    return jwt.sign(userInfo, this.secret, { expiresIn: '1h' });
  }

  static checkJwt(req: Request, res: Response, next: NextFunction) {
    const url = new URL(`http://${req.hostname}:8000${req.url}`);
    if (jwtWhite.includes(url.pathname)) {
      return next();
    }
    try {
      const token = req.header('token');
      if (!token) {
        throw new Error('no token');
      }

      const userJwt: any = jwt.verify(token, myEnv.SECRET_JWT);

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
