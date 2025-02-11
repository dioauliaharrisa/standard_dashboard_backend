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
  outputReport: string;
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
  documentation_details: { name: string; mimetype: string };
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
      console.log('🦆 ~ ReportsService ~ file:', file);

      const buffer = file.buffer;
      // const base64Data = buffer.toString('base64');

      const result: QueryResult = await this.databaseService.query(
        `
          INSERT INTO reports
            (date, section, report, personnels, documentation, documentation_details) 
          VALUES
            ($1, $2, $3, $4, $5, $6) 
          RETURNING 
            id
        `,
        [
          date,
          section,
          JSON.parse(reportDetails),
          personnels,
          buffer,
          { name: file.originalname, mimetype: file.mimetype },
        ],
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

  async getAllReports(): Promise<DTOResponseGetAllReports[]> {
    try {
      const result: QueryResult = await this.databaseService.query(
        'SELECT * FROM reports',
      );

      return result.rows.map((row) => {
        return {
          id: row.id,
          date: row.date,
          section: row.section,
          report: row.report,
          personnels: row.personnels,
          documentation: row.documentation,
          documentation_details: row.documentation_details,
        };
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }
}
