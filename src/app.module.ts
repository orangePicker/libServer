import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';
import { UtilsModule } from './utils/utils.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [PrismaModule, UserModule, UtilsModule, JwtModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
