import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;

        this.logger.error(`❌ ${method} ${url}`, error.stack || error.message);

        // ✅ HttpException bo‘lsa
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const response = error.getResponse();

          const formattedError = {
            success: false,
            statusCode: status,
            message:
              typeof response === 'string' ? response : response['message'],
            error: error.name,
            details: error.message,
            timestamp: this.formatDate(new Date()),
            path: url,
          };

          return throwError(() => new HttpException(formattedError, status));
        }

        // ✅ Ma’lumotlar bazasi xatoliklari
        if (error.code) {
          const dbError = this.handleDatabaseError(error, url);
          return throwError(
            () => new HttpException(dbError, dbError.statusCode),
          );
        }

        // ✅ Noma’lum xatoliklar
        const unknownError = {
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Ichki server xatoligi',
          error: error.name || 'InternalServerError',
          details: error.message,
          stack:
            process.env.NODE_ENV === 'development' ? error.stack : undefined,
          timestamp: this.formatDate(new Date()),
          path: url,
        };

        return throwError(
          () => new HttpException(unknownError, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
    );
  }

  private handleDatabaseError(error: any, path: string) {
    const errorMap = {
      '23505': { status: 409, message: 'Bu ma\'lumot allaqachon mavjud' },
      '23503': { status: 400, message: 'Bog\'liq ma\'lumot topilmadi' },
      '23502': { status: 400, message: 'Majburiy maydon to\'ldirilmagan' },
      '22P02': { status: 400, message: 'Noto\'g\'ri ma\'lumot formati' },
      'ECONNREFUSED': { status: 503, message: 'Ma\'lumotlar bazasiga ulanib bo\'lmadi' },
    };

    const dbError = errorMap[error.code] || {
      status: 500,
      message: 'Ma\'lumotlar bazasi xatoligi',
    };

    return {
      success: false,
      statusCode: dbError.status,
      message: dbError.message,
      error: 'DatabaseError',
      details: error.detail || error.message,
      code: error.code,
      timestamp: this.formatDate(new Date()),
      path,
    };
  }

  private formatDate(date: Date): string {
    const d = date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  }
}
