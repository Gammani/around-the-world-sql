import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
// import { IsValidEmail } from '../../../../../../infrastructure/decorators/validate/email.isValid.decorator';

export class EmailPasswordRecoveryInputModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  // @IsValidEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
