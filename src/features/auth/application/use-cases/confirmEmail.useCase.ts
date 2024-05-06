import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmCodeModel } from '../../api/models/input/confirm.code.model';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class ConfirmEmailCommand {
  constructor(public confirmCodeModel: ConfirmCodeModel) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmEmailCommand): Promise<boolean | null> {
    const foundUser = await this.usersRepository.findUserByConfirmationCode(
      command.confirmCodeModel.code,
    );
    debugger;
    if (foundUser) {
      return await this.usersRepository.updateConfirmationStatus(
        foundUser._id.toString(),
      );
    }
    return null;
  }
}
