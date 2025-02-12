import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateReportDto,
  DTOGetAllReports,
  ReportsService,
} from '../services/reports.service';
import { File } from 'multer';

@Controller('report')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('get-all')
  async getAllReports(@Body() body: DTOGetAllReports) {
    return await this.reportsService.getAllReports(body);
  }

  @Post('get-personnels')
  async getPersonnels() {
    return await this.reportsService.getPersonnels();
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
