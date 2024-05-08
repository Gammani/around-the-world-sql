import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateModelWithBlogId } from '../../api/models/input/post.input.model';
import { PostViewModel } from '../../api/models/output/post.output.model';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelStaticType,
  PostModelWithUriBlogIdStaticType,
} from '../../domain/posts.entity';
import { Model } from 'mongoose';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogDbType } from '../../../../types';

export class CreatePostByAdminCommand {
  constructor(
    public inputPostModel: PostCreateModelWithBlogId,
    public blog: BlogDbType,
  ) {}
}

@CommandHandler(CreatePostByAdminCommand)
export class CreatePostByAdminUseCase
  implements ICommandHandler<CreatePostByAdminCommand>
{
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument> &
      PostModelWithUriBlogIdStaticType &
      PostModelStaticType,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostByAdminCommand): Promise<PostViewModel> {
    const createdPost = this.PostModel.createPost(
      command.inputPostModel,
      command.blog.name,
      this.PostModel,
    );

    return await this.postsRepository.createPostByAdmin(createdPost);
  }
}
