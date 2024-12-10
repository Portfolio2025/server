import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: data?.message || 'Operation successful',
        data: data?.data || null,
      })),
      catchError((err) => {
        response.status(err.status || 400).json({
          success: false,
          message: err.message || 'An error occurred',
        });
        throw err;
      }),
    );
  }
}
