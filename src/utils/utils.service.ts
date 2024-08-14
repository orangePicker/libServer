import { Injectable } from '@nestjs/common';
import { CaptchaService } from 'src/captcha/captcha.service';

@Injectable()
export class UtilsService {
  constructor(private readonly captchaService: CaptchaService) {}
  // 创建验证码
  createCaptcha() {
    const code = this.captchaService.create();
    return code;
  }
}
