import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogUpdateModel } from '../../api/models/input/blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class UpdateBlogByAdminCommand {
  constructor(
    public blogId: string,
    public inputBlogModel: BlogUpdateModel,
  ) {}
}

@CommandHandler(UpdateBlogByAdminCommand)
export class UpdateBlogByAdminUseCase
  implements ICommandHandler<UpdateBlogByAdminCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogByAdminCommand): Promise<boolean> {
    return await this.blogsRepository.updateBlogByAdmin(
      command.blogId,
      command.inputBlogModel,
    );
  }
}
