import { Injectable } from '@nestjs/common';
import {
  ExpiredToken,
  ExpiredTokenDocument,
} from '../domain/expired-token.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PasswordAdapter } from '../../../adapter/password.adapter';

@Injectable()
export class ExpiredTokenRepository {
  constructor(
    @InjectModel(ExpiredToken.name)
    private ExpiredTokenModel: Model<ExpiredTokenDocument>,
    private passwordAdapter: PasswordAdapter,
  ) {}
  async findToken(RefreshToken: string): Promise<boolean> {
    const foundToken = await this.ExpiredTokenModel.findOne({
      refreshToken: RefreshToken,
    });
    return !!foundToken;
  }
  async isExpiredToken(refreshToken: string): Promise<boolean> {
    try {
      const result: any =
        await this.passwordAdapter.jwtRefreshTokenVerify(refreshToken);
      return false;
    } catch (error: any) {
      console.log(error.message);
      return true;
    }
  }
  async addExpiredRefreshToken(
    deviceId: ObjectId,
    userId: ObjectId,
    refreshToken: string,
  ) {
    debugger;
    const newExpiredRefreshToken = {
      _id: new ObjectId(),
      deviceId,
      userId,
      refreshToken,
    };
    const expiredTokenInstance = new this.ExpiredTokenModel(
      newExpiredRefreshToken,
    );

    await expiredTokenInstance.save();
    return;
  }

  async deleteAll() {
    await this.ExpiredTokenModel.deleteMany({});
  }
}
