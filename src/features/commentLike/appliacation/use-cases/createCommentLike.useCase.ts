import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentDbType, LikeStatus } from '../../../types';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  CommentLikeModelStaticType,
} from '../../domain/commentLike.entity';
import { Model } from 'mongoose';
import { CommentLikeRepository } from '../../infrastructure/commentLike.repository';

export class CreateCommentLikeCommand {
  constructor(
    public comment: CommentDbType,
    public likeStatus: LikeStatus,
    public userId: ObjectId,
    public userLogin: string,
  ) {}
}

@CommandHandler(CreateCommentLikeCommand)
export class CreateCommentLikeUseCase
  implements ICommandHandler<CreateCommentLikeCommand>
{
  constructor(
    @InjectModel(CommentLike.name)
    private CommentLikeModel: Model<CommentLikeDocument> &
      CommentLikeModelStaticType,
    private commentLikeRepository: CommentLikeRepository,
  ) {}

  async execute(command: CreateCommentLikeCommand) {
    const createCommentPostLike = this.CommentLikeModel.createCommentLike(
      command.userId,
      command.userLogin,
      command.comment,
      command.likeStatus,
      this.CommentLikeModel,
    );

    return await this.commentLikeRepository.createCommentLike(
      createCommentPostLike,
    );
  }
}
