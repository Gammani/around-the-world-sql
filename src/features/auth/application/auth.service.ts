import { UsersRepository } from '../../users/infrastructure/users.repository';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { ObjectId } from 'mongodb';
import { UserDbType } from '../../types';

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
