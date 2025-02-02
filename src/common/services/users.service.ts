import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database.provider';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async login(email: string, password: string) {
    try {
      const result = await this.databaseService.query(
        `SELECT * FROM users WHERE email = $1 LIMIT 1`,
        [email],
      );

      if (result.rows.length === 0) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const user = result.rows[0];

      if (user.password !== password) {
        throw new UnauthorizedException('Invalid username or password');
      }

      return {
        message: 'Login successful',
        userId: user.id,
        // username: user.username,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
