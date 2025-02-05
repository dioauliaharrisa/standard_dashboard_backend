import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReportDto, ReportsService } from '../services/reports.service';
import { File } from 'multer';

@Controller('report')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('get-all')
  async getAllReports() {
    return await this.reportsService.getAllReports();
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('documentation'))
  async createReport(
    @Body() body: CreateReportDto,
    @UploadedFile() file: File,
  ) {
    return await this.reportsService.createReport(body, file);
  }
}
