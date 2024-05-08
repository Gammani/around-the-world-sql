import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UsersRepository } from '../../../super-admin/users/infrastructure/users.repository';
import { UsersService } from '../../../super-admin/users/application/users.service';
import { UserDbType } from '../../../types';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected userService: UsersService,
  ) {}
  async isConfirmEmailCode(code: string): Promise<boolean> {
    debugger;
    const foundUser: UserDbType | null =
      await this.usersRepository.findUserByConfirmationCode(code);
    if (!foundUser) return false;
    if (foundUser.emailConfirmation.isConfirmed) return false;
    if (foundUser.emailConfirmation.confirmationCode !== code) return false;
    return new Date(foundUser.emailConfirmation.expirationDate) >= new Date();
  }
  async validateUser(
    loginOrEmail: string,
    pass: string,
  ): Promise<ObjectId | null> {
    debugger;
    const user: UserDbType | null = await this.userService.checkCredentials(
      loginOrEmail,
      pass,
    );
    if (user) {
      return user._id;
    } else {
      return null;
    }
  }
}
