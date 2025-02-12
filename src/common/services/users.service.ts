import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database.provider';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
}

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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const user: User = result.rows[0];

      if (user.password !== password) {
        throw new UnauthorizedException('Invalid username or password');
      }

      return {
        message: 'Login successful',
        name: user.name,
        id: user.id,
        role: user.role,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
