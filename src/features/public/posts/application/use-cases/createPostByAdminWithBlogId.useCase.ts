import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateModel } from '../../api/models/input/post.input.model';
import { ObjectId } from 'mongodb';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelStaticType,
  PostModelWithUriBlogIdStaticType,
} from '../../domain/posts.entity';
import { Model } from 'mongoose';

export class CreatePostByAdminWithBlogIdCommand {
  constructor(
    public createInputPostModel: PostCreateModel,
    public blogId: ObjectId,
    public blogName: string,
  ) {}
}

@CommandHandler(CreatePostByAdminWithBlogIdCommand)
export class CreatePostByAdminWithBlogIdUseCase
  implements ICommandHandler<CreatePostByAdminWithBlogIdCommand>
{
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument> &
      PostModelWithUriBlogIdStaticType &
      PostModelStaticType,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostByAdminWithBlogIdCommand) {
    const createdPost = this.PostModel.createPostWithUriBlogId(
      command.createInputPostModel,
      command.blogId,
      command.blogName,
      this.PostModel,
    );

    return await this.postsRepository.createPostByAdmin(createdPost);
  }
}
