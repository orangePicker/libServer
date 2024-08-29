import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cors from 'cors';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { JwtService } from './jwt/jwt.service';
import { LoggerMiddleware } from './middleware/logger/LoggerMiddleware';
import * as dayjs from 'dayjs';
import { NextFunction, Request } from 'express';
import { myEnv } from './utils/utils';

try {
  // 实例化日志
  const loggerMiddleware = new LoggerMiddleware();
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 优先级最顶
    // add logger
    // edit httpException

    // cors
    app.use(
      cors({
        origin: ['http://127.0.0.1:8000', 'http://localhost:8000'],
        credentials: true,
      }),
    );

    // 使用session
    const sessionSecret = myEnv.SECRET_SESSION;
    app.use(
      session({
        secret: sessionSecret,
        name: 'org.sid',
        rolling: true,
        cookie: { maxAge: null },
        resave: true,
        saveUninitialized: false,
      }),
    );

    // 日志
    app.use((req: Request, res: Response, next: NextFunction) => {
      const text = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${req.method} ${req.url}\n`;
      loggerMiddleware.showLogger(text);
      next();
    });

    // 异常过滤
    app.useGlobalFilters(new HttpExceptionFilter());

    // 检查JWT
    app.use(JwtService.checkJwt);
    await app.listen(3000);
  }
  bootstrap();
} catch (error) {
  console.error(error);
  throw new Error(error);
}
