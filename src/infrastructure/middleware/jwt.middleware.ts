import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenPayloadType } from '../../features/types';
import { JwtService } from '../../features/public/auth/application/jwt.service';
import { SecurityDevicesService } from '../../features/public/devices/application/security.devices.service';
import { RequestWithUserId } from '../../features/public/auth/api/models/input/auth.input.model';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private securityDevicesService: SecurityDevicesService,
  ) {}
  async use(
    req: Request & RequestWithUserId,
    res: Response,
    next: NextFunction,
  ) {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (accessToken) {
      const foundDeviceIdByAccessToken: TokenPayloadType | null =
        await this.jwtService.verifyAccessToken(accessToken);
      if (foundDeviceIdByAccessToken) {
        req.user = {
          userId: await this.securityDevicesService.findUserIdByDeviceId(
            foundDeviceIdByAccessToken.deviceId,
          ),
        };
        next();
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
