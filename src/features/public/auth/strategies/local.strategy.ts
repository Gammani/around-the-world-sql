import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string): Promise<string> {
    const userId: string | null = await this.authService.validateUser(
      loginOrEmail,
      password,
    );
    if (!userId) {
      throw new UnauthorizedException();
    }
    return userId;
  }
}
