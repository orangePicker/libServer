import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  public create() {
    return svgCaptcha.create({
      width: 100,
      height: 50,
      fontSize: 40,
      background: '#e3e3e3',
      size: 4,
    });
  }
}
