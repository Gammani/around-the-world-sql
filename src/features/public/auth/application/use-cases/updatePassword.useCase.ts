import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordModel } from '../../api/models/input/new.password.model';
import { PasswordAdapter } from '../../../../adapter/password.adapter';
import { UsersRepository } from '../../../../super-admin/users/infrastructure/users.repository';

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
      command.newPasswordModel.passwordRecoveryCode,
    );
  }
}
