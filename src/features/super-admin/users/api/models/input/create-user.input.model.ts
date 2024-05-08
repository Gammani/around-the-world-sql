import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { LoginIsExist } from '../../../../../../infrastructure/decorators/validate/login.isExist.decorator';
import { EmailIsExist } from '../../../../../../infrastructure/decorators/validate/email.isExist.decorator';

export class UserCreateModel {
  @Trim()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsString()
  @Length(3, 10)
  @IsNotEmpty()
  @LoginIsExist()
  login: string;

  @Trim()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;

  @Trim()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  @EmailIsExist()
  email: string;
}
