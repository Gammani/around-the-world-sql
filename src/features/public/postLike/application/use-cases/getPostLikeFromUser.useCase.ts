import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { PostLikeRepository } from '../../infrastructure/postLike.repository';
import { PostLikeDbType } from '../../../../types';

export class GetPostLikeFromUserCommand {
  constructor(
    public postId: ObjectId,
    public userId: ObjectId,
  ) {}
}

@CommandHandler(GetPostLikeFromUserCommand)
export class GetPostLikeFromUserUseCase
  implements ICommandHandler<GetPostLikeFromUserCommand>
{
  constructor(private postLikeRepository: PostLikeRepository) {}

  async execute(
    command: GetPostLikeFromUserCommand,
  ): Promise<PostLikeDbType | null> {
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
