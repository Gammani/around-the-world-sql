import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/posts.query.repository';
import { ObjectId } from 'mongodb';

export class GetQueryPostByIdCommand {
  constructor(
    public postId: string,
    public userId?: ObjectId | null | undefined,
  ) {}
}

@CommandHandler(GetQueryPostByIdCommand)
export class GetQueryPostByIdUseCase
  implements ICommandHandler<GetQueryPostByIdCommand>
{
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute(command: GetQueryPostByIdCommand) {
    return await this.postsQueryRepository.findPostById(
      command.postId,
      command.userId,
    );
  }
}
