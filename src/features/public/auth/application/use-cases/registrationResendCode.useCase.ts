import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { EmailInputModel } from '../../api/models/input/email.input.model';
import { UsersRepository } from '../../../../super-admin/users/infrastructure/users.repository';
import { EmailManager } from '../../../../adapter/email.manager';
import { UserViewDbModelType } from '../../../../types';
import { add } from 'date-fns/add';

export class RegistrationResendCodeCommand {
  constructor(public emailInputModel: EmailInputModel) {}
}

@CommandHandler(RegistrationResendCodeCommand)
export class RegistrationResendCodeUseCase
  implements ICommandHandler<RegistrationResendCodeCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
  ) {}

  async execute(command: RegistrationResendCodeCommand) {
    const foundUser: UserViewDbModelType | null =
      await this.usersRepository.findUserByLoginOrEmail(
        command.emailInputModel.email,
      );
    if (foundUser && !foundUser.emailConfirmation.isConfirmed) {
      const code = uuidv4();
      const expirationDate = add(new Date(), {
        hours: 1,
        minutes: 3,
      });
      await this.usersRepository.updateConfirmationCode(
        foundUser.id,
        code,
        expirationDate,
      );
      try {
        await this.emailManager.sendEmail(
          command.emailInputModel.email,
          foundUser.accountData.login,
          `\` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
 </p>\``,
        );
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    } else {
      return false;
    }
  }
}
