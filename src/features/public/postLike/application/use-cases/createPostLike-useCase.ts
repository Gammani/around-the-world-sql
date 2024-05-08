import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  PostLikeModelStaticType,
} from '../../domain/postLike.entity';
import { Model } from 'mongoose';
import { PostLikeRepository } from '../../infrastructure/postLike.repository';
import { LikeStatus, PostDbType, UserDbType } from '../../../../types';

export class CreatePostLikeCommand {
  constructor(
    public user: UserDbType,
    public post: PostDbType,
    public likeStatus: LikeStatus,
  ) {}
}

@CommandHandler(CreatePostLikeCommand)
export class CreatePostLikeUseCase
  implements ICommandHandler<CreatePostLikeCommand>
{
  constructor(
    @InjectModel(PostLike.name)
    private PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType,
    private postLikeRepository: PostLikeRepository,
  ) {}

  async execute(command: CreatePostLikeCommand) {
    const createPostLike = this.PostLikeModel.createPostLike(
      command.user._id,
      command.user.accountData.login,
      command.post,
      command.likeStatus,
      this.PostLikeModel,
    );
    return await this.postLikeRepository.createPostLike(createPostLike);
  }
}
