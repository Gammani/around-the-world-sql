import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLikeDbType, LikeStatus } from '../../../types';
import { CommentLikeRepository } from '../../infrastructure/commentLike.repository';

export class UpdateCommentLikeCommand {
  constructor(
    public likeStatus: LikeStatus,
    public like: CommentLikeDbType,
  ) {}
}

@CommandHandler(UpdateCommentLikeCommand)
export class UpdateCommentLikeUseCase
  implements ICommandHandler<UpdateCommentLikeCommand>
{
  constructor(private commentLikeRepository: CommentLikeRepository) {}

  async execute(command: UpdateCommentLikeCommand) {
    return await this.commentLikeRepository.updateLikeStatus(
      command.likeStatus,
      command.like,
    );
  }
}
