import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostByAdminCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostByAdminCommand)
export class DeletePostByAdminUseCase
  implements ICommandHandler<DeletePostByAdminCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: DeletePostByAdminCommand): Promise<boolean> {
    return await this.postsRepository.deletePostById(command.postId);
  }
}
