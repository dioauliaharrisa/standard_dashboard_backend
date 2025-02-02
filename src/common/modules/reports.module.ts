import { Module } from '@nestjs/common';
import { ReportsController } from '../controllers/reports.controller';
import { ReportsService } from '../services/reports.service';
import { DatabaseService } from 'src/database.provider';
import { UsersController } from '../controllers/user.controller';
import { UsersService } from '../services/users.service';

@Module({
  controllers: [ReportsController, UsersController],
  providers: [ReportsService, DatabaseService, UsersService],
})
export class ReportsModule {}
