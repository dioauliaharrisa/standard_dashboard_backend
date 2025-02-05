import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database.provider';

export interface CreateScheduleDto {
  id: string;
  date: Date;
  details: string;
}

interface QueryResult {
  rows: CreateScheduleDto[];
}

@Injectable()
export class ScheduleService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getTodaySchedule() {
    try {
      const result: QueryResult = await this.databaseService.query(
        'SELECT * FROM schedules',
      );

      return result.rows.map((row) => {
        return {
          id: row.id,
          date: row.date,
          details: row.details,
        };
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  async createSchedule({ date, details }: { date: Date; details: string }) {
    try {
      await this.databaseService.query(
        `
          INSERT INTO schedules
            (date, details) 
          VALUES
            ($1, $2) 
          RETURNING 
            id
        `,
        [date, details],
      );
      return { message: 'Schedule created' };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
