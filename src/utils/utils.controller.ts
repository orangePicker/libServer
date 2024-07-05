import { Controller, Get as GetMapping, Header, Session } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Controller('util')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}
  @GetMapping('getCode')
  @Header('Content-type', 'image/svg+xml')
  createCaptcha(@Session() session) {
    const code = this.utilsService.createCaptcha();
    session.code = code.text;
    return code.data;
  }
}
