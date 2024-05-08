import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';
import { CreatedUserViewModel } from '../api/models/output/user.output.model';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { UserDbType } from '../../../types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async findUserById(userId: string | ObjectId): Promise<UserDbType | null> {
    if (!ObjectId.isValid(userId)) {
      throw new NotFoundException();
    }
    return this.UserModel.findById(userId);
  }
  async findUserByLogin(login: string): Promise<UserDbType | null> {
    const foundUser: UserDbType | null = await this.UserModel.findOne({
      'accountData.login': login,
    });
    if (foundUser) {
      return foundUser;
    } else {
      return null;
    }
  }
  async findUserByEmail(email: string): Promise<UserDbType | null> {
    return this.UserModel.findOne({
      'accountData.email': email,
    });
  }
  async findUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDbType | null> {
    debugger;
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': confirmationCode,
    });
  }
  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDbType | null> {
    return this.UserModel.findOne({
      $or: [
        { 'accountData.email': loginOrEmail },
        { 'accountData.login': loginOrEmail },
      ],
    });
  }
  async findUserByRecoveryCode(
    recoveryCode: string,
  ): Promise<UserDbType | null> {
    return this.UserModel.findOne({
      'accountData.recoveryCode': recoveryCode,
    });
  }
  async createUser(createdUserDto: any): Promise<CreatedUserViewModel> {
    const newUser = await createdUserDto.save();
    return {
      id: newUser._id.toString(),
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }
  async loginIsExist(login: string): Promise<boolean> {
    const foundUser = await this.UserModel.findOne({
      'accountData.login': login,
    });
    return !foundUser;
  }
  async emailIsExist(email: string): Promise<boolean> {
    const foundUser = await this.UserModel.findOne({
      'accountData.email': email,
    });
    return !foundUser;
  }
  async emailIsValid(email: string): Promise<boolean> {
    const foundUser = await this.UserModel.findOne({
      'accountData.email': email,
    });
    return !!foundUser;
  }
  async emailIsConfirmed(email: string): Promise<boolean> {
    const foundUser = await this.UserModel.findOne({
      'accountData.email': email,
    });
    if (foundUser) {
      if (foundUser.emailConfirmation.isConfirmed !== true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async updateConfirmationStatus(_id: string): Promise<boolean> {
    debugger;
    const result = await this.UserModel.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }
  async updateConfirmationCode(email: string, code: string): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { 'accountData.email': email },
      { $set: { 'emailConfirmation.confirmationCode': code } },
    );
    return result.modifiedCount === 1;
  }
  async updatePassword(passwordHash: string, recoveryCode: string) {
    return this.UserModel.updateOne(
      { 'accountData.recoveryCode': recoveryCode },
      { $set: { 'accountData.passwordHash': passwordHash } },
    );
  }
  async updateRecoveryCode(email: string, recoveryCode: string) {
    const result = await this.UserModel.updateOne(
      { 'accountData.email': email },
      { $set: { 'accountData.recoveryCode': recoveryCode } },
    );
    return result.modifiedCount === 1;
  }
  async deleteUser(userId: string): Promise<boolean> {
    if (!ObjectId.isValid(userId)) {
      throw new NotFoundException();
      // throw new Error('Invalid userId format');
    }
    const result = await this.UserModel.deleteOne({ _id: userId });
    return result.deletedCount === 1;
  }
  async deleteAll() {
    await this.UserModel.deleteMany({});
    return;
  }
}
