import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInputModel } from '../../../posts/api/models/input/comment.input.model';
import { PostDbType, UserDbType } from '../../../types';
import { CommentViewModel } from '../../api/models/output/comment-output.model';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelStaticType,
} from '../../domain/comments.entity';
import { Model } from 'mongoose';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class CreateCommentCommand {
  constructor(
    public inputCommentModel: CommentInputModel,
    public user: UserDbType,
    public post: PostDbType,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument> & CommentModelStaticType,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentViewModel> {
    const createdComment = this.CommentModel.createComment(
      command.inputCommentModel.content,
      command.user,
      command.post,
      this.CommentModel,
    );
    return await this.commentsRepository.createComment(createdComment);
  }
}
