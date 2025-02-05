import { Module } from '@nestjs/common';
import { ReportsController } from '../controllers/reports.controller';
import { ReportsService } from '../services/reports.service';
import { DatabaseService } from 'src/database.provider';
import { UsersController } from '../controllers/user.controller';
import { UsersService } from '../services/users.service';
import { ScheduleService } from '../services/schedule.service';
import { SchedulesController } from '../controllers/schedules.controller';

@Module({
  controllers: [ReportsController, UsersController, SchedulesController],
  providers: [ReportsService, DatabaseService, UsersService, ScheduleService],
})
export class ReportsModule {}
