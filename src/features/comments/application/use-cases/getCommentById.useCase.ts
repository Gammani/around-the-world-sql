import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentDbType } from '../../../types';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class GetCommentByIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(GetCommentByIdCommand)
export class GetCommentByIdUseCase
  implements ICommandHandler<GetCommentByIdCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: GetCommentByIdCommand): Promise<CommentDbType | null> {
    return await this.commentsRepository.findCommentById(command.commentId);
  }
}
