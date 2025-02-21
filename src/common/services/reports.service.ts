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

export type DTOGetAllReports = {
  id: string;
  role: string;
};
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

interface QueryResultGetPersonnels {
  rows: { id: number; name: string }[];
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

      const buffer = file.buffer;

      const responseCreateReport: QueryResult =
        await this.databaseService.query(
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

      if (!responseCreateReport.rows.length) {
        throw new Error('Failed to retrieve inserted report ID');
      }

      const reportId = responseCreateReport.rows[0].id;

      for (const personnel of personnels) {
        await this.databaseService.query(
          `
           INSERT INTO reports_users
              (user_id, report_id) 
            VALUES
              ($1, $2) 
          `,
          [personnel, reportId],
        );
      }

      return {
        id: +reportId,
      };
    } catch (error) {
      console.error('Error inserting report:', error);
      throw new Error('Failed to create report');
    }
  }

  async getAllReports(
    body: DTOGetAllReports,
  ): Promise<DTOResponseGetAllReports[]> {
    try {
      const { id, role } = body;
      // console.log('🦆 ~ ReportsService ~ id:', id, role);

      const params = role === 'PEGAWAI' ? [id] : [];

      const whereIsRolePimpinan =
        role === 'PEGAWAI'
          ? `
              WHERE EXISTS (
                SELECT 1 FROM reports_users ru 
                WHERE ru.report_id = r.id 
                AND ru.user_id = $1
              )
            `
          : '';

      const queryGetAllReports = `
        WITH personnel_data AS (
          SELECT 
            ur.report_id, 
            STRING_AGG(u.name, ', ') AS personnels
          FROM reports_users ur
          JOIN Users u ON ur.user_id = u.id
          GROUP BY ur.report_id
        )
        SELECT r.*, COALESCE(pd.personnels, '') AS personnels
        FROM reports r
        LEFT JOIN personnel_data pd ON r.id = pd.report_id
        ${whereIsRolePimpinan}
      `;

      const result: QueryResult = await this.databaseService.query(
        queryGetAllReports,
        params,
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

  async getPersonnels() {
    try {
      const result: QueryResultGetPersonnels = await this.databaseService.query(
        'SELECT * FROM users',
      );
      return result.rows.map((row) => {
        return {
          value: row.id.toString(),
          label: row.name,
        };
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to get personnels');
    }
  }
}
