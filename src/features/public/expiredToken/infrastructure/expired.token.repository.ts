import { Injectable } from '@nestjs/common';
import {
  ExpiredToken,
  ExpiredTokenDocument,
} from '../domain/expired-token.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PasswordAdapter } from '../../../adapter/password.adapter';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { v1 as uuidv1 } from 'uuid';

@Injectable()
export class ExpiredTokenRepository {
  constructor(
    @InjectModel(ExpiredToken.name)
    private ExpiredTokenModel: Model<ExpiredTokenDocument>,
    private passwordAdapter: PasswordAdapter,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async findToken(RefreshToken: string): Promise<boolean> {
    const foundToken = await this.dataSource.query(
      `SELECT id, "deviceId", "userId", "refreshToken"
  FROM public."ExpiredToken"
  WHERE "refreshToken" = $1`,
      [RefreshToken],
    );
    if (foundToken.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  async isExpiredToken(refreshToken: string): Promise<boolean> {
    try {
      await this.passwordAdapter.jwtRefreshTokenVerify(refreshToken);
      return false;
    } catch (error: any) {
      console.log(error.message);
      return true;
    }
  }
  async addExpiredRefreshToken(
    deviceId: ObjectId | string,
    userId: ObjectId | string,
    refreshToken: string,
  ) {
    debugger;
    const newExpiredRefreshToken = {
      id: uuidv1(),
      deviceId,
      userId,
      refreshToken,
    };

    await this.dataSource.query(
      `INSERT INTO public."ExpiredToken"(
  id, "deviceId", "userId", "refreshToken")
  VALUES ($1, $2, $3, $4);`,
      [
        newExpiredRefreshToken.id,
        newExpiredRefreshToken.deviceId,
        newExpiredRefreshToken.userId,
        newExpiredRefreshToken.refreshToken,
      ],
    );
    return;
  }
  async removeAllExpiredTokensByDeviceIdFromUserIdAllSessionExcludeCurrent(
    deviceId: string,
    userId: string,
  ) {
    await this.dataSource.query(
      `DELETE FROM public."ExpiredToken"
WHERE "ExpiredToken"."deviceId" <> $1
AND "ExpiredToken"."userId" = $2`,
      [deviceId, userId],
    );
  }
  async removeExpiredTokensByDeviceId(deviceId: string) {
    await this.dataSource.query(
      `DELETE FROM public."ExpiredToken"
WHERE "ExpiredToken"."deviceId"=$1`,
      [deviceId],
    );
  }
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."ExpiredToken"`);
  }
}
