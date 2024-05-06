import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelStaticType } from '../domain/user.entity';
import { Model } from 'mongoose';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { UserDbType } from '../../types';
import { ObjectId } from 'mongodb';
import { SecurityDevicesService } from '../../devices/application/security.devices.service';

@Injectable()
export class UsersService {
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
    protected securityDevicesService: SecurityDevicesService,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument> & UserModelStaticType,
  ) {}

  async findUserByDeviceId(deviceId: ObjectId): Promise<UserDbType | null> {
    const userId =
      await this.securityDevicesService.findUserIdByDeviceId(deviceId);
    if (userId) {
      return await this.usersRepository.findUserById(userId);
    } else {
      return null;
    }
  }
  async findUserByRecoveryCode(
    recoveryCode: string,
  ): Promise<UserDbType | null> {
    return await this.usersRepository.findUserByRecoveryCode(recoveryCode);
  }
  async loginIsExist(login: string): Promise<boolean> {
    return await this.usersRepository.loginIsExist(login);
  }
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDbType | null> {
    const user: UserDbType | null =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;
    if (!user.emailConfirmation.isConfirmed) return null;

    const isHashesEquals: any = await this.passwordAdapter.isPasswordCorrect(
      password,
      user.accountData.passwordHash,
    );
    if (isHashesEquals) {
      return user;
    } else {
      return null;
    }
  }
  async emailIsExist(email: string): Promise<boolean> {
    return await this.usersRepository.emailIsExist(email);
  }
  async emailIsValid(email: string): Promise<boolean> {
    return await this.usersRepository.emailIsValid(email);
  }
  async emailIsConfirmed(email: string): Promise<boolean> {
    return await this.usersRepository.emailIsConfirmed(email);
  }
}
