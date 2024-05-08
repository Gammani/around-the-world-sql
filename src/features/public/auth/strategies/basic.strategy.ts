import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public validate = async (username, password): Promise<boolean> => {
    const adminLogin = this.configService.get('ADMIN_LOGIN');
    const adminPassword = this.configService.get('ADMIN_PASS');
    if (adminLogin !== username || adminPassword !== password) {
      throw new UnauthorizedException();
    } else return true;
  };
}
