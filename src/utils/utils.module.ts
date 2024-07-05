import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { CaptchaModule } from 'src/captcha/captcha.module';

@Module({
  imports: [CaptchaModule],
  controllers: [UtilsController],
  providers: [UtilsService],
})
export class UtilsModule {}
