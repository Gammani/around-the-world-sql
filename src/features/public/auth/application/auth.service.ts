import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../super-admin/users/infrastructure/users.repository';
import { UsersService } from '../../../super-admin/users/application/users.service';
import { UserViewDbModelType, UserViewEmailDbType } from '../../../types';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected userService: UsersService,
  ) {}
  async isConfirmEmailCode(confirmationCode: string): Promise<boolean> {
    debugger;
    const foundUser: UserViewEmailDbType | null =
      await this.usersRepository.findUserByConfirmationCode(confirmationCode);
    if (!foundUser) return false;
    if (foundUser.isConfirmed) return false;
    if (foundUser.confirmationCode !== confirmationCode) return false;
    return new Date(foundUser.expirationDate) >= new Date();
  }
  async validateUser(
    loginOrEmail: string,
    pass: string,
  ): Promise<string | null> {
    const user: UserViewDbModelType | null =
      await this.userService.checkCredentials(loginOrEmail, pass);
    if (user) {
      return user.id;
    } else {
      return null;
    }
  }
}
