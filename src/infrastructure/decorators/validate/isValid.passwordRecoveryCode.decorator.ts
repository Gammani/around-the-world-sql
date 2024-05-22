import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../features/super-admin/users/application/users.service';

export function IsValidPasswordRecoveryCode(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsValidPasswordRecoveryCodeConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidPasswordRecoveryCode', async: false })
@Injectable()
export class IsValidPasswordRecoveryCodeConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UsersService) {}
  async validate(passwordRecoveryCode: string) {
    return await this.userService.findUserByPasswordRecoveryCode(
      passwordRecoveryCode,
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'recovery code has not correct';
  }
}
