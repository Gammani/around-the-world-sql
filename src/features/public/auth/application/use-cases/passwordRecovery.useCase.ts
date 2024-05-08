import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { EmailPasswordRecoveryInputModel } from '../../api/models/input/email.passwordRecovery.input.model';
import { EmailManager } from '../../../../adapter/email.manager';
import { UsersRepository } from '../../../../super-admin/users/infrastructure/users.repository';

export class PasswordRecoveryCommand {
  constructor(
    public emailPasswordRecoveryInputModel: EmailPasswordRecoveryInputModel,
  ) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private emailManager: EmailManager,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const foundUser = await this.usersRepository.findUserByLoginOrEmail(
      command.emailPasswordRecoveryInputModel.email,
    );
    if (foundUser) {
      const recoveryCode = uuidv4();
      await this.usersRepository.updateRecoveryCode(
        command.emailPasswordRecoveryInputModel.email,
        recoveryCode,
      );
      await this.emailManager.sendEmail(
        command.emailPasswordRecoveryInputModel.email,
        foundUser.accountData.login,
        `\` <h1>Password recovery</h1>
 <p>To finish password recovery please follow the link below:
     <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
 </p>\``,
      );
    }
  }
}
