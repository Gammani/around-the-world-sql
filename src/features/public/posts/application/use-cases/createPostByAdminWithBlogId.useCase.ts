import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreatedPostDtoType,
  PostCreateModel,
} from '../../api/models/input/post.input.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelStaticType,
  PostModelWithUriBlogIdStaticType,
} from '../../domain/posts.entity';
import { Model } from 'mongoose';
import { v1 as uuidv1 } from 'uuid';

export class CreatePostByAdminWithBlogIdCommand {
  constructor(
    public createInputPostModel: PostCreateModel,
    public blogId: string,
    public blogName: string,
  ) {}
}

@CommandHandler(CreatePostByAdminWithBlogIdCommand)
export class CreatePostByAdminWithBlogIdUseCase
  implements ICommandHandler<CreatePostByAdminWithBlogIdCommand>
{
  constructor(
    // @InjectModel(Post.name)
    // private PostModel: Model<PostDocument> &
    //   PostModelWithUriBlogIdStaticType &
    //   PostModelStaticType,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostByAdminWithBlogIdCommand) {
    const createdPost: CreatedPostDtoType = {
      id: uuidv1(),
      title: command.createInputPostModel.title,
      shortDescription: command.createInputPostModel.shortDescription,
      content: command.createInputPostModel.content,
      blogId: command.blogId,
      blogName: command.blogName,
      createdAt: new Date(),
    };
    return await this.postsRepository.createPostByAdmin(createdPost);
  }
}
