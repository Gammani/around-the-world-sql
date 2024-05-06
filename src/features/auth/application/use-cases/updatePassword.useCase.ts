import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordAdapter } from '../../../adapter/password.adapter';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { NewPasswordModel } from '../../api/models/input/new.password.model';

export class UpdatePasswordCommand {
  constructor(public newPasswordModel: NewPasswordModel) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private passwordAdapter: PasswordAdapter,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: UpdatePasswordCommand) {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      command.newPasswordModel.newPassword,
    );

    return this.usersRepository.updatePassword(
      passwordHash,
      command.newPasswordModel.recoveryCode,
    );
  }
}
