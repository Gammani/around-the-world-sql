import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLikeDbType } from '../../../types';
import { ObjectId } from 'mongodb';
import { CommentLikeRepository } from '../../infrastructure/commentLike.repository';

export class GetCommentLikeCommand {
  constructor(
    public commentId: ObjectId,
    public userId: ObjectId,
  ) {}
}

@CommandHandler(GetCommentLikeCommand)
export class GetCommentLikeUseCase
  implements ICommandHandler<GetCommentLikeCommand>
{
  constructor(private commentLikeRepository: CommentLikeRepository) {}

  async execute(
    command: GetCommentLikeCommand,
  ): Promise<CommentLikeDbType | null> {
    const foundCommentLike: CommentLikeDbType | null =
      await this.commentLikeRepository.findLike(
        command.commentId,
        command.userId,
      );
    if (foundCommentLike) {
      return foundCommentLike;
    } else {
      return null;
    }
  }
}
