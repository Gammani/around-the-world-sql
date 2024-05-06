import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { EmailIsConfirmed } from '../../../../../infrastructure/decorators/validate/email.isConfirmed.decorator';

export class EmailInputModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @EmailIsConfirmed()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
