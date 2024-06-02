import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentLikeRepository } from '../../../commentLike/infrastructure/commentLike.repository';

export class DeleteCommentByIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(DeleteCommentByIdCommand)
export class DeleteCommentByIdUseCase
  implements ICommandHandler<DeleteCommentByIdCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private commentLikeRepository: CommentLikeRepository,
  ) {}

  async execute(command: DeleteCommentByIdCommand): Promise<boolean> {
    await this.commentLikeRepository.deleteCommentLikesByPostId(
      command.commentId,
    );
    return await this.commentsRepository.deleteComment(command.commentId);
  }
}
