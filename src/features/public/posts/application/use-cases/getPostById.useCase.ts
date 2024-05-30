import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostViewDbType } from '../../../../types';

export class GetPostByIdCommand {
  constructor(public postId: string) {}
}

@CommandHandler(GetPostByIdCommand)
export class GetPostByIdUseCase implements ICommandHandler<GetPostByIdCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: GetPostByIdCommand): Promise<PostViewDbType | null> {
    return await this.postsRepository.findPostById(command.postId);
  }
}
