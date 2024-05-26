import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpiredTokenRepository } from '../../expiredToken/infrastructure/expired.token.repository';
import { JwtService } from '../application/jwt.service';
import { DeviceRepository } from '../../devices/infrastructure/device.repository';
import { DeviceDbViewModelType, TokenPayloadType } from '../../../types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class CheckRefreshToken {
  constructor(
    private expiredTokenRepository: ExpiredTokenRepository,
    private jwtService: JwtService,
    private deviceRepository: DeviceRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    debugger;
    const cookieRefreshToken = req.cookies.refreshToken;
    if (!cookieRefreshToken) throw new UnauthorizedException();

    const foundTokenFromExpiredTokens =
      await this.expiredTokenRepository.findToken(cookieRefreshToken);
    // console.log(foundTokenFromExpiredTokens);
    if (foundTokenFromExpiredTokens) throw new UnauthorizedException();

    const isExpiredToken =
      await this.expiredTokenRepository.isExpiredToken(cookieRefreshToken);
    if (isExpiredToken) throw new UnauthorizedException();

    const foundDeviceIdByRefreshToken: TokenPayloadType | null =
      await this.jwtService.verifyRefreshToken(cookieRefreshToken);
    if (foundDeviceIdByRefreshToken) {
      const foundDeviceByDeviceId: DeviceDbViewModelType | null =
        await this.deviceRepository.findDeviceByDeviceId(
          foundDeviceIdByRefreshToken.deviceId.toString(),
        );
      if (foundDeviceByDeviceId) {
        req.deviceId = foundDeviceIdByRefreshToken.deviceId;
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
    return true;
  }
}
