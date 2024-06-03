import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../../../super-admin/blogs/infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { BlogWithPaginationViewModel } from './models/output/blog.output.model';
import { RequestWithUserId } from '../../auth/api/models/input/auth.input.model';
import { GetBlogByIdCommand } from '../application/use-cases/getBlogById.useCase';
import { PostsWithPaginationViewModel } from '../../posts/api/models/output/post.output.model';
import { GetAllQueryBlogsCommand } from '../application/use-cases/getAllQueryBlogs.useCase';
import { GetQueryPostsCommand } from '../../posts/application/use-cases/getQueryPostsUseCase';
import { GetQueryBlogByIdCommand } from '../application/use-cases/getQueryBlogById.useCase';
import { Request } from 'express';
import { PostViewDbType } from '../../../types';
import { GetPostByIdCommand } from '../../posts/application/use-cases/getPostById.useCase';
import { GetQueryPostByIdCommand } from '../../posts/application/use-cases/getQueryPostById.useCase';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogQueryRepository: BlogsQueryRepository,
    private readonly postQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllBlogs(
    @Query()
    query: {
      searchNameTerm: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
      pageNumber: string | undefined;
      pageSize: string | undefined;
    },
  ) {
    const foundBlogs: BlogWithPaginationViewModel =
      await this.commandBus.execute(
        new GetAllQueryBlogsCommand(
          query.searchNameTerm,
          query.sortBy,
          query.sortDirection,
          query.pageNumber,
          query.pageSize,
        ),
      );
    return foundBlogs;
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Req() req: Request & RequestWithUserId,
    @Query()
    query: {
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundBlogById = await this.commandBus.execute(
      new GetBlogByIdCommand(blogId),
    );
    if (foundBlogById) {
      const foundPostsByBlogId: PostsWithPaginationViewModel =
        await this.commandBus.execute(
          new GetQueryPostsCommand(
            query.pageNumber,
            query.pageSize,
            query.sortBy,
            query.sortDirection,
            req.user?.userId,
            blogId,
          ),
        );
      return foundPostsByBlogId;
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  async findBlogById(@Param('id') blogId: string) {
    const foundBlog = await this.commandBus.execute(
      new GetQueryBlogByIdCommand(blogId),
    );
    if (foundBlog) {
      return foundBlog;
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':blogId/posts/:id')
  async findPostById(
    @Param('id') postId: string,
    @Req() req: Request & RequestWithUserId,
  ) {
    const foundPost: PostViewDbType | null = await this.commandBus.execute(
      new GetPostByIdCommand(postId),
    );
    if (foundPost) {
      return await this.commandBus.execute(
        new GetQueryPostByIdCommand(foundPost, req.user?.userId),
      );
      // return console.log(res);
    } else {
      throw new NotFoundException();
    }
  }
}
