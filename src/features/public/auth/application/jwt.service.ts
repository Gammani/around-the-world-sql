import jwt, { Secret } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PasswordAdapter } from '../../../adapter/password.adapter';

@Injectable()
export class JwtService {
  constructor(
    private configService: ConfigService,
    private passwordAdapter: PasswordAdapter,
  ) {}

  async createAccessJWT(deviceId: ObjectId | string) {
    return jwt.sign(
      { deviceId },
      this.configService.get('JWT_ACCESS_SECRET') as Secret,
      {
        expiresIn: 10,
      },
    );
  }
  async createRefreshJWT(deviceId: ObjectId | string) {
    return jwt.sign(
      { deviceId },
      this.configService.get('JWT_REFRESH_SECRET') as Secret,
      {
        expiresIn: 20,
      },
    );
  }
  async verifyRefreshToken(refreshToken: string) {
    return await this.passwordAdapter.jwtRefreshTokenVerify(refreshToken);
  }
  async verifyAccessToken(accessToken: string) {
    return await this.passwordAdapter.jwtAccessTokenVerify(accessToken);
  }
}
