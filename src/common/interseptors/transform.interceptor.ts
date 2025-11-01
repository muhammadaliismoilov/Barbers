// src/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private dateFields = ['createdAt', 'updatedAt'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.formatData(data)), // Faqat formatlash
    );
  }

  private formatDate(date: Date | string| null): string | null{
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  }

  private formatData(item: any): any {
    if (!item || typeof item !== 'object') return item;
    if (Array.isArray(item)) return item.map((i) => this.formatData(i));

    return Object.keys(item).reduce((acc, key) => {
      const value = item[key];
      acc[key] = this.dateFields.includes(key) && value
        ? this.formatDate(value)
        : typeof value === 'object'
        ? this.formatData(value)
        : value;
      return acc;
    }, {});
  }
}