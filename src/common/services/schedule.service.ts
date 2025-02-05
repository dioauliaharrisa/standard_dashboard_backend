import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database.provider';

export interface CreateScheduleDto {
  id: string;
  date: Date;
  details: string;
}

export interface DTOGetTodaySchedule {
  id: string;
  date: Date;
  details: string;
  totalReportsTeknis: any;
}

// interface QueryResultGetTodaySchedule {
//   rows: DTOGetTodaySchedule[];
// }

// interface QueryResultGetTodaySchedule {
//   rows: DTOGetTodaySchedule[];
// }

const queryGetTotalReportsTeknis = `
SELECT 
json_build_object(
 'Inspeksi HACCP', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'Inspeksi HACCP')::text, '0'),
 'Suveillance HACCP', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'Suveillance HACCP')::text, '0'),
 'Inspeksi SKP', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'Inspeksi SKP')::text, '0'),
 'CPIB', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'CPIB')::text, '0'),
 'CPIB Kapal', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'CPIB Kapal')::text, '0'),
 'CPOIB', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'CPOIB')::text, '0'),
 'CDOIB', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'CDOIB')::text, '0'),
 'CPPIB', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'CPPIB')::text, '0'),
 'CBIB', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'CBIB')::text, '0'),
 'SKP', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'SKP')::text, '0'),
 'SPDI', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'SPDI')::text, '0')
) as totalReportsTeknis
FROM reports
 `;

const queryGetTotalReportsDukman = `
SELECT 
json_build_object(
 'TU Kepegawaian', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'TU Kepegawaian')::text, '0'),
 'Keuangan', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'Keuangan')::text, '0'),
 'RTP', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'RTP')::text, '0'),
 'Penataan Arsip', COALESCE(COUNT(*) FILTER (WHERE report->>'type' = 'Penataan Arsip')::text, '0')
) as totalReportsTeknis
FROM reports
 `;

@Injectable()
export class ScheduleService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getTodaySchedule() {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM schedules',
      );

      const totalReportsTeknis = await this.databaseService.query(
        queryGetTotalReportsTeknis,
      );

      const totalReportsDukman = await this.databaseService.query(
        queryGetTotalReportsDukman,
      );

      return {
        schedules: result.rows.map((row) => {
          return {
            id: row.id,
            date: row.date,
            details: row.details,
          };
        }),
        totalReportsTeknis: totalReportsTeknis.rows[0].totalreportsteknis,
        totalReportsDukman: totalReportsDukman.rows[0].totalreportsteknis,
      };
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
