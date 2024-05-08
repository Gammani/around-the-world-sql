import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { IsValidRecoveryCode } from '../../../../../../infrastructure/decorators/validate/isValid.recoveryCode.decorator';

export class NewPasswordModel {
  @Trim()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  newPassword: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsValidRecoveryCode()
  recoveryCode: string;
}
