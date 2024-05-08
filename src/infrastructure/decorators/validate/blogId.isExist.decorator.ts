import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsService } from '../../../features/public/blogs/application/blogs.service';

export function BlogIdIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: BlogIdIsExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'BlogIdIsExist', async: false })
@Injectable()
export class BlogIdIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogService: BlogsService) {}
  async validate(blogId: string) {
    const foundBlogId = await this.blogService.findBlogById(blogId);
    return !!foundBlogId;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'BlogId is not found';
  }
}
