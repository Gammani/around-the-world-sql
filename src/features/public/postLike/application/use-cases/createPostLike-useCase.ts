import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  PostLikeModelStaticType,
} from '../../domain/postLike.entity';
import { Model } from 'mongoose';
import { PostLikeRepository } from '../../infrastructure/postLike.repository';
import {
  CreatedPostLikeDtoType,
  LikeStatus,
  PostViewDbType,
  UserViewDbModelType,
} from '../../../../types';
import { v1 as uuidv1 } from 'uuid';

export class CreatePostLikeCommand {
  constructor(
    public user: UserViewDbModelType,
    public post: PostViewDbType,
    public likeStatus: LikeStatus,
  ) {}
}

@CommandHandler(CreatePostLikeCommand)
export class CreatePostLikeUseCase
  implements ICommandHandler<CreatePostLikeCommand>
{
  constructor(
    // @InjectModel(PostLike.name)
    // private PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType,
    private postLikeRepository: PostLikeRepository,
  ) {}

  async execute(command: CreatePostLikeCommand) {
    const createdPostLike: CreatedPostLikeDtoType = {
      id: uuidv1(),
      userId: command.user.id,
      login: command.user.accountData.login,
      post: command.post,
      likeStatus: command.likeStatus,
      addedAt: new Date(),
      lastUpdate: new Date(),
    };
    return await this.postLikeRepository.createPostLike(createdPostLike);
  }
}
