import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cors from 'cors';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { JwtService } from './jwt/jwt.service';
import { config } from 'dotenv';

async function bootstrap() {
  const sessionSecret = config().parsed.SECRET_SESSION
  const app = await NestFactory.create(AppModule);
  // 优先级最顶
  // add logger
  // edit httpException
  app.use(
    cors({
      origin: [
        'http://127.0.0.1:8000',
        'http://localhost:8000'
      ],
      credentials: true,
    }),
  );
  app.use(
    session({
      secret: sessionSecret,
      name: 'org.sid',
      rolling: true,
      cookie: { maxAge: null },
      resave: true,
      saveUninitialized: false
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(JwtService.checkJwt);
  await app.listen(3000);
}
bootstrap();
