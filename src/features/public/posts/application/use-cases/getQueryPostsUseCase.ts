import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/posts.query.repository';
import { PostsWithPaginationViewModel } from '../../api/models/output/post.output.model';
import { ObjectId } from 'mongodb';

export class GetQueryPostsCommand {
  constructor(
    public pageNumber: string | undefined,
    public pageSize: string | undefined,
    public sortBy: string | undefined,
    public sortDirection: string | undefined,
    public userId?: ObjectId | string | null | undefined,
    public blogId?: string,
  ) {}
}

@CommandHandler(GetQueryPostsCommand)
export class GetQueryPostsUseCase
  implements ICommandHandler<GetQueryPostsCommand>
{
  constructor(private readonly postQueryRepository: PostsQueryRepository) {}

  async execute(command: GetQueryPostsCommand) {
    const foundPostsByBlogId: PostsWithPaginationViewModel =
      await this.postQueryRepository.findPosts(
        command.pageNumber,
        command.pageSize,
        command.sortBy,
        command.sortDirection,
        command.userId,
        command.blogId,
      );

    return foundPostsByBlogId;
  }
}
