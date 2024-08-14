import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, map } from 'rxjs';

interface Data<T = any> {
  code: number;
  data: T;
  message: string;
  time: number;
}

@Injectable()
export class SuccessReaponse<T> implements NestInterceptor {
  private now = Date.now();
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Data<T>> {
    const res = context.switchToHttp().getResponse<Response>();
    const req = context.switchToHttp().getRequest<Request>();
    if (req.method === 'POST') {
      res.statusCode = HttpStatus.OK;
    }

    return next.handle().pipe(
      map(
        ({
          data = null,
          code = 200,
          message = '操作成功',
          time = this.now,
        }) => {
          return {
            data,
            code,
            message,
            time,
          };
        },
      ),
    );
  }
}
