import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateModel } from '../../api/models/input/create-user.input.model';
import { CreatedUserViewModel } from '../../api/models/output/user.output.model';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordAdapter } from '../../../../adapter/password.adapter';

export class CreateUserByAdminCommand {
  constructor(public inputUserModel: UserCreateModel) {}
}

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminUseCase
  implements ICommandHandler<CreateUserByAdminCommand>
{
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
  ) {}

  async execute(
    command: CreateUserByAdminCommand,
  ): Promise<CreatedUserViewModel> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      command.inputUserModel.password,
    );
    const createdUser = {
      inputUserModel: command.inputUserModel,
      passwordHash: passwordHash,
      isConfirmed: true,
    };

    return await this.usersRepository.createUser(createdUser);
  }
}
