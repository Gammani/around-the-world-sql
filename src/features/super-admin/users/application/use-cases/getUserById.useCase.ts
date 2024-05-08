import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserDbType } from '../../../../types';

export class GetUserByIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetUserByIdCommand)
export class GetUserByIdUseCase implements ICommandHandler<GetUserByIdCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: GetUserByIdCommand): Promise<UserDbType | null> {
    return this.usersRepository.findUserById(command.userId);
  }
}
