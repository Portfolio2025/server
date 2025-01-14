import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import * as fs from 'fs';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get the HTTP context and response object
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Handle the request and modify the response
    return next.handle().pipe(
      // Transform the response data
      map((data) => ({
        success: true,
        message: data?.message || 'Operation successful',
        data: data?.data || null,
      })),
      // Catch and handle errors
      catchError((err) => {
        // If there is an uploaded file and it exists, delete it
        const filePath = request.file?.path;
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        // Send error response
        response.status(err.status || 400).json({
          success: false,
          message: err.message || 'An error occurred',
        });
        // Rethrow the error to propagate it
        throw err;
      }),
    );
  }
}