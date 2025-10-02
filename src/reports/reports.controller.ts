import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportDto } from './dto/report.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  @ApiQuery({ name: 'date', required: true, example: '2025-09-25' })
  async getDailyReport(@Query('date') date: string): Promise<ReportDto> {
    return this.reportsService.getDailyReport(date);
  }
}
