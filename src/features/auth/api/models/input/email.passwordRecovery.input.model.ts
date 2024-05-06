import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsValidEmail } from '../../../../../infrastructure/decorators/validate/email.isValid.decorator';

export class EmailPasswordRecoveryInputModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsValidEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
