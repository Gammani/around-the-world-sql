import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreatedPostDtoType,
  PostCreateModelWithBlogId,
} from '../../api/models/input/post.input.model';
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
import { BlogViewDbType } from '../../../../types';
import { v1 as uuidv1 } from 'uuid';

export class CreatePostByAdminCommand {
  constructor(
    public inputPostModel: PostCreateModelWithBlogId,
    public blog: BlogViewDbType,
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
    const createdPost: CreatedPostDtoType = {
      id: uuidv1(),
      title: command.inputPostModel.title,
      shortDescription: command.inputPostModel.shortDescription,
      content: command.inputPostModel.content,
      blogId: command.inputPostModel.blogId,
      blogName: command.blog.name,
      createdAt: new Date(),
    };

    return await this.postsRepository.createPostByAdmin(createdPost);
  }
}
