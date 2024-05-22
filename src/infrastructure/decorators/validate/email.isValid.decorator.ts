import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../features/super-admin/users/application/users.service';

export function IsValidEmail(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsValidEmailConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidEmail', async: false })
@Injectable()
export class IsValidEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}
  async validate(email: string) {
    return await this.userService.emailIsValid(email);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'email has not correct';
  }
}
