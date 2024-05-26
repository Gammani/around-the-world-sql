import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { PostsRepository } from '../../../../public/posts/infrastructure/posts.repository';

export class RemoveBlogByAdminCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(RemoveBlogByAdminCommand)
export class RemoveBlogByAdminUseCase
  implements ICommandHandler<RemoveBlogByAdminCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: RemoveBlogByAdminCommand): Promise<boolean> {
    await this.postsRepository.deleteAllPostsByBlogId(command.blogId);
    return await this.blogsRepository.deleteBlog(command.blogId);
  }
}
