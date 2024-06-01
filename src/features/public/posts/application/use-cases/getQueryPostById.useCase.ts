import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/posts.query.repository';
import { PostViewDbType } from '../../../../types';

export class GetQueryPostByIdCommand {
  constructor(
    public post: PostViewDbType,
    public userId?: string | null | undefined,
  ) {}
}

@CommandHandler(GetQueryPostByIdCommand)
export class GetQueryPostByIdUseCase
  implements ICommandHandler<GetQueryPostByIdCommand>
{
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute(command: GetQueryPostByIdCommand) {
    return await this.postsQueryRepository.findPostById(
      command.post,
      command.userId,
    );
  }
}
