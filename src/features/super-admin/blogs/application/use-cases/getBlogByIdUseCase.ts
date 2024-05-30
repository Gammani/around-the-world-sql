import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogViewDbType } from '../../../../types';

export class GetBlogByIdCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(GetBlogByIdCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: GetBlogByIdCommand): Promise<BlogViewDbType | null> {
    return await this.blogsRepository.findBlogById(command.blogId);
  }
}
