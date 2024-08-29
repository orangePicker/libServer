import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request, Response } from 'express';
import { LoggerMiddleware } from 'src/middleware/logger/LoggerMiddleware';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const loggerMiddleware = new LoggerMiddleware();
    let response = null;
    let request = null;
    let statusCode = 500;

    try {
      const ctx = host.switchToHttp();
      response = ctx.getResponse<Response>();
      request = ctx.getRequest<Request>();

      // 保存错误日志
      const logText = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${request.method} ${request.url} ${exception.message}\n`;
      loggerMiddleware.showLogger(logText, 'error');
      // 是否Http异常
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus() === 0 ? 0 : exception.getStatus();
      } else {
        statusCode = 501;
      }
    } catch (error) {
      console.error(error);
    }

    const status = statusCode || 500;
    const code = statusCode || 500;
    const message = '系统错误';
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
