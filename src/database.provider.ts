import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: process.env.DB_NAME,
    });
  }

  async onModuleInit() {
    await this.pool.connect();
    await this.createUsersTable();

    console.log('Connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  private async createUsersTable() {
    const qCreateTableUsers = `
      CREATE TABLE IF NOT EXISTS "users" (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `;

    const qCreateTableReports = `
      CREATE TABLE IF NOT EXISTS "reports" (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
        section TEXT NOT NULL,                               
        personnels TEXT NOT NULL,                     
        report JSONB,          
        documentation BYTEA, 
        documentation_details JSONB                      
      );
    `;

    const qCreateTableSchedules = `
    CREATE TABLE IF NOT EXISTS "schedules" (
      id SERIAL PRIMARY KEY,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
      details TEXT NOT NULL                      
    );
  `;

    try {
      await this.pool.query(qCreateTableUsers);
      await this.pool.query(qCreateTableReports);
      await this.pool.query(qCreateTableSchedules);
      console.log('Users table ensured');
    } catch (error) {
      console.error('Error creating Users table:', error);
    }
  }

  async query(queryText: string, params?: any[]): Promise<any> {
    try {
      return await this.pool.query(queryText, params);
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}
