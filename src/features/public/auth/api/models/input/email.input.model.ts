import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { EmailIsConfirmed } from '../../../../../../infrastructure/decorators/validate/email.isConfirmed.decorator';

export class EmailInputModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @EmailIsConfirmed()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
