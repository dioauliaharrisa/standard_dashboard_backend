import { Controller, Post, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('login')
  async createReport(@Body() body: { date: Date }) {
    return this.reportsService.createReport(body);
  }
}
