import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateInputPostModelType } from '../../api/models/input/post.input.model';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostByAdminCommand {
  constructor(
    public postId: string,
    public inputPostModel: UpdateInputPostModelType,
  ) {}
}

@CommandHandler(UpdatePostByAdminCommand)
export class UpdatePostByAdminUseCase
  implements ICommandHandler<UpdatePostByAdminCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: UpdatePostByAdminCommand): Promise<boolean> {
    return await this.postsRepository.updatePostByAdmin(
      command.postId,
      command.inputPostModel,
    );
  }
}
