import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.provider';

// DTO for input validation
interface CreateReportDto {
  date: Date;
  section: string;
  report: { type: string };
  documentation: string;
}

// DTO for response format
interface ReportResponseDto {
  id: number;
  date: Date;
  section: string;
  report: object;
  documentation: string;
}
interface QueryResult {
  rows: { id: number }[];
}

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createReports(body: CreateReportDto): Promise<ReportResponseDto> {
    try {
      const { date, section, report, documentation } = body;

      const result: QueryResult = await this.databaseService.query(
        'INSERT INTO reports(date, section, report_type, documentation) values ($1, $2, $3, $4) returning id',
        [date, section, report, documentation],
      );

      if (!result.rows.length) {
        throw new InternalServerErrorException(
          'Failed to retrieve inserted report ID',
        );
      }
      
      return {
        id: result.rows[0].id,
        date,
        section,
        report,
        documentation,
      };
    } catch (error) {
      console.error('Error inserting report:', error);
      throw new Error('Failed to create report');
    }
  }
}
