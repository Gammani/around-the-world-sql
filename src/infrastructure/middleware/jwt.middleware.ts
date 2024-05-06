import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenPayloadType } from '../../features/types';
import { JwtService } from '../../features/auth/application/jwt.service';
import { SecurityDevicesService } from '../../features/devices/application/security.devices.service';
import { RequestWithUserId } from '../../features/auth/api/models/input/auth.input.model';

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
        console.log(req.user);
        debugger;
        next();
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
