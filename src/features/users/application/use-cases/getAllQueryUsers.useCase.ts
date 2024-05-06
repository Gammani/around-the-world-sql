import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserWithPaginationViewModel } from '../../api/models/output/user.output.model';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';

export class GetAllQueryUsersCommand {
  constructor(
    public searchLoginTerm: string | undefined,
    public searchEmailTerm: string | undefined,
    public pageNumber: string | undefined,
    public pageSize: string | undefined,
    public sortBy: string | undefined,
    public sortDirection: string | undefined,
  ) {}
}

@CommandHandler(GetAllQueryUsersCommand)
export class GetAllQueryUsersUseCase
  implements ICommandHandler<GetAllQueryUsersCommand>
{
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(command: GetAllQueryUsersCommand) {
    const foundUsers: UserWithPaginationViewModel =
      await this.usersQueryRepository.findAllUsers(
        command.searchLoginTerm,
        command.searchEmailTerm,
        command.pageNumber,
        command.pageSize,
        command.sortBy,
        command.sortDirection,
      );
    return foundUsers;
  }
}
