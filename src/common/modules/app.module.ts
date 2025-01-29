import { Module } from '@nestjs/common';
import { DatabaseService } from '../../database.provider';
import { ReportsModule } from './reports.module';

@Module({
  imports: [ReportsModule],
  controllers: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
