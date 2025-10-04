import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportDto } from './dto/report.dto';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
@ApiOperation({
  summary: 'Kunlik hisobotni olish',
  description:
    'Berilgan sanaga oid kunlik hisobotni qaytaradi. Agar sana kiritilmasa, hozirgi kun uchun hisobot qaytariladi.',
})
@ApiQuery({
  name: 'date',
  required: false,
  example: '2025-09-25',
  description: 'Hisobot olinadigan sana (format: YYYY-MM-DD). Agar kiritilmasa, bir kun oldingi sana olinadi.',
})
@ApiResponse({
  status: 200,
  description: 'Hisobot muvaffaqiyatli qaytarildi',
  type: ReportDto,
})
@ApiResponse({
  status: 400,
  description: 'Noto‘g‘ri sana formati kiritilgan',
})
@ApiResponse({
  status: 404,
  description: 'Berilgan sana uchun ma’lumot topilmadi',
})
async getDailyReport(@Query('date') date?: string): Promise<ReportDto> {
  return this.reportsService.getDailyReport(date);
}

}
