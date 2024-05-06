import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../features/users/application/users.service';

export function EmailIsConfirmed(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailIsConfirmedConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'EmailIsExist', async: false })
@Injectable()
export class EmailIsConfirmedConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UsersService) {}
  async validate(email: string) {
    return await this.userService.emailIsConfirmed(email);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'email already confirmed';
  }
}
