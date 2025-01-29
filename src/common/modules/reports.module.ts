import { Module } from '@nestjs/common';
import { ReportsController } from '../controllers/reports.controller';
import { ReportsService } from '../services/reports.service';
import { DatabaseService } from 'src/database.provider';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, DatabaseService],
})
export class ReportsModule {}
