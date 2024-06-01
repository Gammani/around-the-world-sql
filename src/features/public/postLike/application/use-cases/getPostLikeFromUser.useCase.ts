import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostLikeRepository } from '../../infrastructure/postLike.repository';
import { PostLikeViewDbType } from '../../../../types';

export class GetPostLikeFromUserCommand {
  constructor(
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(GetPostLikeFromUserCommand)
export class GetPostLikeFromUserUseCase
  implements ICommandHandler<GetPostLikeFromUserCommand>
{
  constructor(private postLikeRepository: PostLikeRepository) {}

  async execute(
    command: GetPostLikeFromUserCommand,
  ): Promise<PostLikeViewDbType | null> {
    const result = await this.postLikeRepository.findPostLike(
      command.postId,
      command.userId,
    );
    if (result) {
      return result;
    } else {
      return null;
    }
  }
}
