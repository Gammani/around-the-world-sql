import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';

export class DeleteUserByAdminCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserByAdminCommand)
export class DeleteUserByAdminUseCase
  implements ICommandHandler<DeleteUserByAdminCommand>
{
  constructor(protected usersRepository: UsersRepository) {}

  async execute(command: DeleteUserByAdminCommand): Promise<boolean> {
    return await this.usersRepository.deleteUser(command.userId);
  }
}
