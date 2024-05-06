import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsWithPaginationViewModel } from '../../api/models/output/comment-output.model';
import { CommentsQueryRepository } from '../../infrastructure/comments.query.repository';
import { ObjectId } from 'mongodb';

export class GetQueryCommentsByPostIdCommand {
  constructor(
    public pageNumber: string | undefined,
    public pageSize: string | undefined,
    public sortBy: string | undefined,
    public sortDirection: string | undefined,
    public postId: string,
    public userId?: ObjectId | null | undefined,
  ) {}
}

@CommandHandler(GetQueryCommentsByPostIdCommand)
export class GetQueryCommentsByPostIdUseCase
  implements ICommandHandler<GetQueryCommentsByPostIdCommand>
{
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute(
    command: GetQueryCommentsByPostIdCommand,
  ): Promise<CommentsWithPaginationViewModel> {
    return await this.commentsQueryRepository.findComments(
      command.pageNumber,
      command.pageSize,
      command.sortBy,
      command.sortDirection,
      command.postId,
      command.userId,
    );
  }
}
