import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { BlogsService } from '../application/blogs.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { PostsService } from '../../posts/application/posts.service';
import { BlogWithPaginationViewModel } from './models/output/blog.output.model';
import {
  BlogCreateModel,
  BlogUpdateModel,
} from './models/input/blog.input.model';
import { PostsWithPaginationViewModel } from '../../posts/api/models/output/post.output.model';
import { PostCreateModel } from '../../posts/api/models/input/post.input.model';
import { BlogDbType } from '../../types';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllQueryBlogsCommand } from '../application/use-cases/getAllQueryBlogs.useCase';
import { CreateBlogByAdminCommand } from '../application/use-cases/createBlogByAdmin.useCase';
import { GetBlogByIdCommand } from '../application/use-cases/getBlogById.useCase';
import { GetQueryPostsCommand } from '../../posts/application/use-cases/getQueryPosts.useCase';
import { CreatePostByAdminWithBlogIdCommand } from '../../posts/application/use-cases/createPostByAdminWithBlogId.useCase';
import { GetQueryBlogByIdCommand } from '../application/use-cases/getQueryBlogById.useCase';
import { UpdateBlogByAdminCommand } from '../application/use-cases/updateBlogByAdmin.useCase';
import { Request } from 'express';
import { RequestWithUserId } from '../../auth/api/models/input/auth.input.model';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogQueryRepository: BlogsQueryRepository,
    private readonly blogService: BlogsService,
    private readonly postQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
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

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlogByAdmin(@Body() inputBlogModel: BlogCreateModel) {
    return this.commandBus.execute(
      new CreateBlogByAdminCommand(inputBlogModel),
    );
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

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogIdByAdmin(
    @Param('blogId') blogId: string,
    @Body() inputPostModel: PostCreateModel,
  ) {
    const foundBlog: BlogDbType | null = await this.commandBus.execute(
      new GetBlogByIdCommand(blogId),
    );
    if (foundBlog) {
      return await this.commandBus.execute(
        new CreatePostByAdminWithBlogIdCommand(
          inputPostModel,
          foundBlog._id,
          foundBlog.name,
        ),
      );
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  async findBlogById(@Param('id') blogId: string) {
    return await this.commandBus.execute(new GetQueryBlogByIdCommand(blogId));
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlogByAdmin(
    @Param('id') blogId: string,
    @Body() inputBlogModel: BlogUpdateModel,
  ) {
    const foundBlog = await this.commandBus.execute(
      new GetBlogByIdCommand(blogId),
    );
    if (foundBlog) {
      await this.commandBus.execute(
        new UpdateBlogByAdminCommand(blogId, inputBlogModel),
      );
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async removeBlogByAdmin(@Param('id') blogId: string) {
    const foundBlog = await this.commandBus.execute(
      new GetBlogByIdCommand(blogId),
    );
    if (foundBlog) {
      const blogRemoved = await this.blogService.removeBlogByAdmin(blogId);
      if (!blogRemoved) {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
  }
}
