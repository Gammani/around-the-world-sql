import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../features/super-admin/users/application/users.service';

export function LoginIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: LoginIsExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'LoginIsExist', async: false })
@Injectable()
export class LoginIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}
  async validate(login: string) {
    return await this.userService.loginIsExist(login);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'login already exists';
  }
}
