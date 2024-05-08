import { EmailCodeIsConfirm } from '../../../../../../infrastructure/decorators/validate/email-code-is-confirm-constraint.service';

export class ConfirmCodeModel {
  @EmailCodeIsConfirm()
  code: string;
}
