import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class DeleteCommentByIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(DeleteCommentByIdCommand)
export class DeleteCommentByIdUseCase
  implements ICommandHandler<DeleteCommentByIdCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentByIdCommand): Promise<boolean> {
    return await this.commentsRepository.deleteComment(command.commentId);
  }
}
