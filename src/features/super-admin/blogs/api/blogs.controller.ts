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
import {
  BlogCreateModel,
  BlogUpdateModel,
} from './models/input/blog.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogByAdminCommand } from '../application/use-cases/createBlogByAdmin.useCase';
import { GetBlogByIdCommand } from '../application/use-cases/getBlogByIdUseCase';
import { UpdateBlogByAdminCommand } from '../application/use-cases/updateBlogByAdmin.useCase';
import { BlogViewDbType, PostViewDbType } from '../../../types';
import { PostsQueryRepository } from '../../../public/posts/infrastructure/posts.query.repository';
import { PostsService } from '../../../public/posts/application/posts.service';
import { BasicAuthGuard } from '../../../public/auth/guards/basic-auth.guard';
import {
  PostCreateModel,
  UpdateInputPostModelType,
} from '../../../public/posts/api/models/input/post.input.model';
import { CreatePostByAdminWithBlogIdCommand } from '../../../public/posts/application/use-cases/createPostByAdminWithBlogId.useCase';
import { RequestWithUserId } from '../../../public/auth/api/models/input/auth.input.model';
import { PostsWithPaginationViewModel } from '../../../public/posts/api/models/output/post.output.model';
import { GetQueryPostsCommand } from '../../../public/posts/application/use-cases/getQueryPostsUseCase';
import { GetPostByIdCommand } from '../../../public/posts/application/use-cases/getPostById.useCase';
import { UpdatePostByAdminCommand } from '../../../public/posts/application/use-cases/updatePostByAdmin.useCase';
import { DeletePostByAdminCommand } from '../../../public/posts/application/use-cases/deletePostByAdmin.useCase';
import { RemoveBlogByAdminCommand } from '../application/use-cases/removeBlogByAdmin.useCase';
import { GetQueryBlogByIdCommand } from '../../../public/blogs/application/use-cases/getQueryBlogById.useCase';
import { BlogWithPaginationViewModel } from '../../../public/blogs/api/models/output/blog.output.model';
import { GetAllQueryBlogsCommand } from '../../../public/blogs/application/use-cases/getAllQueryBlogs.useCase';
import { Request } from 'express';
import { GetQueryPostByIdCommand } from '../../../public/posts/application/use-cases/getQueryPostById.useCase';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
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

  @UseGuards(BasicAuthGuard)
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
  @Post()
  async createBlogByAdmin(@Body() inputBlogModel: BlogCreateModel) {
    return this.commandBus.execute(
      new CreateBlogByAdminCommand(inputBlogModel),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogIdByAdmin(
    @Param('blogId') blogId: string,
    @Body() inputPostModel: PostCreateModel,
  ) {
    const foundBlog: BlogViewDbType | null = await this.commandBus.execute(
      new GetBlogByIdCommand(blogId),
    );
    if (foundBlog) {
      return await this.commandBus.execute(
        new CreatePostByAdminWithBlogIdCommand(
          inputPostModel,
          foundBlog.id,
          foundBlog.name,
        ),
      );
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlogByAdmin(
    @Param('id') blogId: string,
    @Body() inputBlogModel: BlogUpdateModel,
  ) {
    const foundBlog: BlogViewDbType | null = await this.commandBus.execute(
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
  @Put(':blogId/posts/:id')
  @HttpCode(204)
  async updatePostByAdmin(
    @Param('id') postId: string,
    @Param('blogId') blogId: string,
    @Body() inputPostModel: UpdateInputPostModelType,
  ) {
    const foundBlog: BlogViewDbType | null = await this.commandBus.execute(
      new GetBlogByIdCommand(blogId),
    );
    if (foundBlog) {
      const foundPost: PostViewDbType | null = await this.commandBus.execute(
        new GetPostByIdCommand(postId),
      );
      if (foundPost) {
        await this.commandBus.execute(
          new UpdatePostByAdminCommand(postId, blogId, inputPostModel),
        );
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async removeBlogByAdmin(@Param('id') blogId: string) {
    const foundBlog: BlogViewDbType | null = await this.commandBus.execute(
      new GetBlogByIdCommand(blogId),
    );
    if (foundBlog) {
      await this.commandBus.execute(new RemoveBlogByAdminCommand(foundBlog.id));
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':blogId/posts/:id')
  @HttpCode(204)
  async removePostByAdmin(
    @Param('id') postId: string,
    @Param('blogId') blogId: string,
  ) {
    const foundBlog: BlogViewDbType | null = await this.commandBus.execute(
      new GetBlogByIdCommand(blogId),
    );
    if (foundBlog) {
      const foundPost = await this.commandBus.execute(
        new GetPostByIdCommand(postId),
      );
      if (foundPost) {
        await this.commandBus.execute(new DeletePostByAdminCommand(postId));
      } else {
        throw new NotFoundException();
      }
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
