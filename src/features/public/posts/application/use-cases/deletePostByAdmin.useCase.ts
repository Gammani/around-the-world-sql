import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostLikeRepository } from '../../../postLike/infrastructure/postLike.repository';

export class DeletePostByAdminCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostByAdminCommand)
export class DeletePostByAdminUseCase
  implements ICommandHandler<DeletePostByAdminCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private postLikeRepository: PostLikeRepository,
  ) {}

  async execute(command: DeletePostByAdminCommand): Promise<boolean> {
    await this.postLikeRepository.deletePostLikesByPostId(command.postId);
    return await this.postsRepository.deletePostById(command.postId);
  }
}
