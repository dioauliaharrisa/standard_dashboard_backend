import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.provider';
import { File } from 'multer';

// DTO for input validation
export interface CreateReportDto {
  date: Date;
  section: string;
  report: { type: string };
  personnels: string;
  reportDetails;
  outputReports;
  // documentation: File;
}

// DTO for response format
export interface ReportResponseDto {
  id: number;
  // date: Date;
  // section: string;
  // report: object;
  // documentation: string;
}
interface QueryResult {
  rows: DTOResponseGetAllReports[];
}

export interface DTOResponseGetAllReports {
  id: number;
  date: Date;
  section: string;
  personnels: string;
  report: object;
  documentation: File;
}

@Injectable()
export class ReportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createReport(
    body: CreateReportDto,
    file: File,
  ): Promise<ReportResponseDto> {
    try {
      const { date, section, reportDetails, personnels } = body;

      const buffer = file.buffer;

      const result: QueryResult = await this.databaseService.query(
        `
          INSERT INTO reports
            (date, section, personnels, report, documentation) 
          VALUES
            ($1, $2, $3, $4, $5) 
          RETURNING 
            id
        `,
        [date, section, personnels, JSON.parse(reportDetails), buffer],
      );

      if (!result.rows.length) {
        throw new Error('Failed to retrieve inserted report ID');
      }

      return {
        id: result.rows[0].id,
      };
    } catch (error) {
      console.error('Error inserting report:', error);
      throw new Error('Failed to create report');
    }
  }

  async getAllReports(page: number): Promise<DTOResponseGetAllReports[]> {
    try {
      const result: QueryResult = await this.databaseService.query(
        'SELECT * FROM reports',
      );
      console.log('🦆 ~ ReportsService ~ getAllReports ~ result:', result);

      return result.rows.map((row) => {
        return {
          id: row.id,
          date: row.date,
          section: row.section,
          report: row.report,
          personnels: row.personnels,
          documentation: row.documentation,
        };
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }
}
