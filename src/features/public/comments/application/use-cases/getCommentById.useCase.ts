import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentViewDbType } from '../../../../types';

export class GetCommentByIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(GetCommentByIdCommand)
export class GetCommentByIdUseCase
  implements ICommandHandler<GetCommentByIdCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(
    command: GetCommentByIdCommand,
  ): Promise<CommentViewDbType | null> {
    return await this.commentsRepository.findCommentById(command.commentId);
  }
}
