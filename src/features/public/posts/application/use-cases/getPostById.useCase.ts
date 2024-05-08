import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostDbType } from '../../../../types';

export class GetPostByIdCommand {
  constructor(public postId: string) {}
}

@CommandHandler(GetPostByIdCommand)
export class GetPostByIdUseCase implements ICommandHandler<GetPostByIdCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: GetPostByIdCommand): Promise<PostDbType | null> {
    return await this.postsRepository.findPostById(command.postId);
  }
}
