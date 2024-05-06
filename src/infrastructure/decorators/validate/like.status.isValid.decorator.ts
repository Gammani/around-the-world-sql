import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../../features/types';

export function LikeStatusIsValid(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: LikeStatusIsValidConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'LikeStatusIsValid', async: false })
@Injectable()
export class LikeStatusIsValidConstraint
  implements ValidatorConstraintInterface
{
  constructor() {}
  async validate(likeStatus: LikeStatus) {
    if (!likeStatus) return false;
    return !(
      likeStatus !== 'None' &&
      likeStatus !== 'Like' &&
      likeStatus !== 'Dislike'
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Like-status is not valid';
  }
}
