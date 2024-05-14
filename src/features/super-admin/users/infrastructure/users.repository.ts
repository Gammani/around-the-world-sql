import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDbType } from '../../../types';
import { CreatedUserDtoModel } from '../api/models/input/CreatedUserDto.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { v4 as uuidv4, v1 as uuidv1, validate as validateUUID } from 'uuid';
import { add } from 'date-fns/add';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findUserById(userId: string): Promise<UserDbType | null> {
    if (validateUUID(userId)) {
      const foundUser = await this.dataSource.query(
        `SELECT account."id", account.login, account.email, account."createdAt", account."passwordHash",
        account."recoveryCode", email."confirmationCode", email."expirationDate"
    FROM public."UserAccountData" as account
    LEFT JOIN "UserEmailData" as email
    ON account."id" = email."userId"
WHERE account."id" = $1`,
        [userId],
      );
      if (foundUser.length > 0) {
        return foundUser;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async findUserByLogin(login: string): Promise<UserDbType | null> {
    const foundUser: UserDbType | null = await this.dataSource.query(
      `SELECT "id", "login", "email", "createdAt", "passwordHash", "recoveryCode"
    FROM public."UserAccountData"
    WHERE "login" = $1`,
      [login],
    );
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

  async createUserByAdmin(createdUserDto: CreatedUserDtoModel): Promise<any> {
    const userAccountDate = {
      id: uuidv1(),
      login: createdUserDto.inputUserModel.login,
      email: createdUserDto.inputUserModel.email,
      createdAt: new Date(),
      passwordHash: createdUserDto.passwordHash,
      recoveryCode: uuidv4(),
    };
    const userEmailDate = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 3,
      }),
      isConfirmed: true,
    };

    await this.dataSource.query(
      `INSERT INTO public."UserAccountData"(id, login, email, "createdAt", "passwordHash", "recoveryCode")VALUES ($1, $2, $3, $4, $5, $6);`,
      [
        userAccountDate.id,
        userAccountDate.login,
        userAccountDate.email,
        userAccountDate.createdAt,
        userAccountDate.passwordHash,
        userAccountDate.recoveryCode,
      ],
    );

    await this.dataSource.query(
      `INSERT INTO public."UserEmailData"(
        id, "confirmationCode", "expirationDate", "isConfirmed", "userId")
    VALUES ($1, $2, $3, $4, $5);`,
      [
        uuidv4(),
        userEmailDate.confirmationCode,
        userEmailDate.expirationDate,
        userEmailDate.isConfirmed,
        userAccountDate.id,
      ],
    );
  }

  async createUser(createdUserDto: CreatedUserDtoModel): Promise<any> {
    const userAccountDate = {
      id: uuidv1(),
      login: createdUserDto.inputUserModel.login,
      email: createdUserDto.inputUserModel.email,
      createdAt: new Date(),
      passwordHash: createdUserDto.passwordHash,
      recoveryCode: uuidv4(),
    };
    const userEmailDate = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 3,
      }),
      isConfirmed: false,
    };

    await this.dataSource.query(
      `INSERT INTO public."UserAccountData"(id, login, email, "createdAt", "passwordHash", "recoveryCode")VALUES ($1, $2, $3, $4, $5, $6);`,
      [
        userAccountDate.id,
        userAccountDate.login,
        userAccountDate.email,
        userAccountDate.createdAt,
        userAccountDate.passwordHash,
        userAccountDate.recoveryCode,
      ],
    );

    await this.dataSource.query(
      `INSERT INTO public."UserEmailData"(
        id, "confirmationCode", "expirationDate", "isConfirmed", "userId")
    VALUES ($1, $2, $3, $4, $5);`,
      [
        uuidv4(),
        userEmailDate.confirmationCode,
        userEmailDate.expirationDate,
        userEmailDate.isConfirmed,
        userAccountDate.id,
      ],
    );
  }

  async loginIsExist(login: string): Promise<boolean> {
    const foundUser = await this.dataSource.query(
      `SELECT "login"
    FROM public."UserAccountData"
    WHERE "login" = $1`,
      [login],
    );
    return foundUser.length <= 0;
  }

  async emailIsExist(email: string): Promise<boolean> {
    const foundUser = await this.dataSource.query(
      `SELECT "id", "login", "email", "createdAt", "passwordHash", "recoveryCode"
    FROM public."UserAccountData"
    WHERE "email" = $1`,
      [email],
    );
    return foundUser.length <= 0;
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
    const foundUser = await this.findUserById(userId);
    if (validateUUID(userId) && foundUser) {
      await this.dataSource.query(
        `DELETE FROM public."UserEmailData"
WHERE "userId" = $1;`,
        [userId],
      );
      await this.dataSource.query(
        `DELETE FROM public."UserAccountData"
WHERE "id" = $1;`,
        [userId],
      );
      return true;
    } else {
      return false;
    }
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."UserEmailData"`);
    await this.dataSource.query(`DELETE FROM public."UserAccountData"`);
    return;
  }
}
