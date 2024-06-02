import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserViewDbModelType } from '../../../../types';

export class GetUserByIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetUserByIdCommand)
export class GetUserByIdUseCase implements ICommandHandler<GetUserByIdCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    command: GetUserByIdCommand,
  ): Promise<UserViewDbModelType | null> {
    return this.usersRepository.findUserById(command.userId);
  }
}
