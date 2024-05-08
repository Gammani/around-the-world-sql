import { ExecutionContext, Injectable } from '@nestjs/common';
import { TokenPayloadType } from '../../../features/types';
import { JwtService } from '../../../features/public/auth/application/jwt.service';

@Injectable()
export class CheckToken {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const cookieRefreshToken = req.cookies.refreshToken;
    if (cookieRefreshToken) {
      const foundDeviceIdByRefreshToken: TokenPayloadType | null =
        await this.jwtService.verifyRefreshToken(cookieRefreshToken);
      if (foundDeviceIdByRefreshToken) {
        req.deviceId = foundDeviceIdByRefreshToken.deviceId;
      } else {
        return true;
      }
    }
    return true;
  }
}
