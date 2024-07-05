import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cors from 'cors';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { JwtService } from './jwt/jwt.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 优先级最顶
  app.use(
    cors({
      origin: [
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'http://localhost:80',
        'http://i.kokomi.online',
      ],
      credentials: true,
    }),
  );
  app.use(
    session({
      secret: 'org',
      name: 'org.sid',
      rolling: true,
      cookie: { maxAge: null },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(JwtService.checkJwt);
  await app.listen(3000);
}
bootstrap();
