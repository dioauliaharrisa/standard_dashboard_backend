import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.provider';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async login(username: string, password: string) {
    // if (result.rows.length === 0) {
    //   throw new Error('User not found');
    // }

    // const user = result.rows[0];

    // if (user.password !== password) {
    //   throw new Error('Invalid password');
    // }

    return {
      // id: user.id,
      // username: user.username,
      // name: user.name,
      // role: user.role,
    };
  }
}
