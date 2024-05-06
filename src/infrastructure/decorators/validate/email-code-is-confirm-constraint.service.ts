import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../features/auth/application/auth.service';

export function EmailCodeIsConfirm(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailCodeIsConfirmConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'EmailCodeIsConfirm', async: false })
@Injectable()
export class EmailCodeIsConfirmConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly authService: AuthService) {}
  async validate(code: string) {
    debugger;
    return await this.authService.isConfirmEmailCode(code);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'code is incorrect';
  }
}
