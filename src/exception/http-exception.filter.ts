import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('this exceptionCenter');
    console.log(exception);

    let response = null;
    let statusCode = 500;
    let msg = '系统错误';

    try {
      const ctx = host.switchToHttp();
      response = ctx.getResponse<Response>();
      // 是否Http异常
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus() === 0 ? 0 : exception.getStatus();
        msg = exception.message;
      } else {
        statusCode = 501;
        msg = 'System Error => ' + exception;
      }
    } catch (error) {
      console.error(error);
    }

    const status = statusCode || 500;
    const code = statusCode || 500;
    const message = msg || '系统错误 nest';
    const time = Date.now();
    const data = null;

    response.status(status).json({
      data,
      code,
      message,
      time,
    });
  }
}
