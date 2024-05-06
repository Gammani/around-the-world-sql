import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpiredTokenRepository } from '../../expiredToken/infrastructure/expired.token.repository';
import { JwtService } from '../application/jwt.service';
import { TokenPayloadType } from '../../types';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt') {}

@Injectable()
export class CheckAccessToken {
  constructor(
    private expiredTokenRepository: ExpiredTokenRepository,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    debugger;
    const req = context.switchToHttp().getRequest();

    const accessToken = req.headers.authorization?.split(' ')[1];

    const foundDeviceIdByAccessToken: TokenPayloadType | null =
      await this.jwtService.verifyAccessToken(accessToken);
    console.log(foundDeviceIdByAccessToken);
    debugger;
    if (foundDeviceIdByAccessToken) {
      req.deviceId = foundDeviceIdByAccessToken.deviceId;
    } else {
      throw new UnauthorizedException();
    }
    return true;
  }
}
