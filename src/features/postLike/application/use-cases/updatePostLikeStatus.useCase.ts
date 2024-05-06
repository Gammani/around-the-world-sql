import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus, PostLikeDbType } from '../../../types';
import { PostLikeRepository } from '../../infrastructure/postLike.repository';

export class UpdatePostLikeStatusCommand {
  constructor(
    public likeStatus: LikeStatus,
    public like: PostLikeDbType,
  ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase implements ICommandHandler {
  constructor(private postLikeRepository: PostLikeRepository) {}

  async execute(command: UpdatePostLikeStatusCommand) {
    return await this.postLikeRepository.updatePostLikeStatus(
      command.likeStatus,
      command.like,
    );
  }
}
