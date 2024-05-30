import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query.repository';

export class GetAllQueryBlogsCommand {
  constructor(
    public searchNameTerm: string | undefined,
    public sortBy: string | undefined,
    public sortDirection: string | undefined,
    public pageNumber: string | undefined,
    public pageSize: string | undefined,
  ) {}
}

@CommandHandler(GetAllQueryBlogsCommand)
export class GetAllQueryBlogsUseCase
  implements ICommandHandler<GetAllQueryBlogsCommand>
{
  constructor(private blogQueryRepository: BlogsQueryRepository) {}

  async execute(command: GetAllQueryBlogsCommand) {
    return await this.blogQueryRepository.findAllBlogs(
      command.searchNameTerm,
      command.sortBy,
      command.sortDirection,
      command.pageNumber,
      command.pageSize,
    );
  }
}
