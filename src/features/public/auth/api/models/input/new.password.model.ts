import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { IsValidPasswordRecoveryCode } from '../../../../../../infrastructure/decorators/validate/isValid.passwordRecoveryCode.decorator';

export class NewPasswordModel {
  @Trim()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  newPassword: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsValidPasswordRecoveryCode()
  passwordRecoveryCode: string;
}
