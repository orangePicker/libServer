import {
  Controller,
  Get as GetMapping,
  Header,
  HttpException,
  HttpStatus,
  Session,
} from '@nestjs/common';
import { UtilsService } from './utils.service';

@Controller('util')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}
  @GetMapping('getCode')
  @Header('Content-type', 'image/svg+xml')
  createCaptcha(@Session() session) {
    try {
      const code = this.utilsService.createCaptcha();
      session.code = code.text;
      return code.data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
