import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelStaticType } from '../domain/user.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PasswordAdapter } from '../../../adapter/password.adapter';
import { SecurityDevicesService } from '../../../public/devices/application/security.devices.service';
import { UserDbViewModelType } from '../../../types';

@Injectable()
export class UsersService {
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
    protected securityDevicesService: SecurityDevicesService,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument> & UserModelStaticType,
  ) {}

  async findUserByDeviceId(
    deviceId: string,
  ): Promise<UserDbViewModelType | null> {
    const userId =
      await this.securityDevicesService.findUserIdByDeviceId(deviceId);
    if (userId) {
      return await this.usersRepository.findUserById(userId);
    } else {
      return null;
    }
  }
  async findUserByRecoveryCode(recoveryCode: string): Promise<boolean> {
    return await this.usersRepository.findUserByRecoveryCode(recoveryCode);
  }
  async findUserByPasswordRecoveryCode(
    passwordRecoveryCode: string,
  ): Promise<boolean> {
    return await this.usersRepository.findUserByPasswordRecoveryCode(
      passwordRecoveryCode,
    );
  }
  async loginIsExist(login: string): Promise<boolean> {
    return await this.usersRepository.loginIsExist(login);
  }
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDbViewModelType | null> {
    const user: UserDbViewModelType | null =
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
