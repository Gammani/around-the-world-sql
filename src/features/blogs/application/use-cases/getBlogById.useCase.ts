import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogDbType } from '../../../types';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class GetBlogByIdCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(GetBlogByIdCommand)
export class GetBlogByIdUseCase implements ICommandHandler<GetBlogByIdCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: GetBlogByIdCommand): Promise<BlogDbType | null> {
    return await this.blogsRepository.findBlogById(command.blogId);
  }
}
