import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BlogCreateModel,
  CreatedBlogType,
} from '../../api/models/input/blog.input.model';
import { Model } from 'mongoose';
import {
  Blog,
  BlogDocument,
  BlogModelStaticType,
} from '../../domain/blogs.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CreatedBlogViewModel } from '../../api/models/output/blog.output.model';

export class CreateBlogByAdminCommand {
  constructor(public inputBlogModel: BlogCreateModel) {}
}

@CommandHandler(CreateBlogByAdminCommand)
export class CreateBlogByAdminUseCase
  implements ICommandHandler<CreateBlogByAdminCommand>
{
  constructor(
    // @InjectModel(Blog.name)
    // private BlogModel: Model<BlogDocument> & BlogModelStaticType,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(
    command: CreateBlogByAdminCommand,
  ): Promise<CreatedBlogViewModel> {
    const createdBlog: CreatedBlogType = {
      name: command.inputBlogModel.name,
      description: command.inputBlogModel.description,
      websiteUrl: command.inputBlogModel.websiteUrl,
    };

    return await this.blogsRepository.createBlogByAdmin(createdBlog);
  }
}
