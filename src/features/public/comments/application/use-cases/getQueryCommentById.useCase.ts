import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentViewModel } from '../../api/models/output/comment-output.model';
import { CommentsQueryRepository } from '../../infrastructure/comments.query.repository';
import { CommentViewDbType } from '../../../../types';

export class GetQueryCommentByIdCommand {
  constructor(
    public comment: CommentViewDbType,
    public userId?: string,
  ) {}
}

@CommandHandler(GetQueryCommentByIdCommand)
export class GetQueryCommentByIdUseCase
  implements ICommandHandler<GetQueryCommentByIdCommand>
{
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute(
    command: GetQueryCommentByIdCommand,
  ): Promise<CommentViewModel | null> {
    return await this.commentsQueryRepository.getQueryCommentByComment(
      command.comment,
      command.userId,
    );
  }
}
