import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity';
import { BlogsController } from './api/blogs.controller';
import { BlogsQueryRepository } from './infrastructure/blogs.query.repository';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { PostsQueryRepository } from '../posts/infrastructure/posts.query.repository';
import { Post, PostSchema } from '../posts/domain/posts.entity';
import { PostLike, PostLikeSchema } from '../postLike/domain/postLike.entity';
import { PostsService } from '../posts/application/posts.service';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllQueryBlogsUseCase } from './application/use-cases/getAllQueryBlogs.useCase';
import { CreateBlogByAdminUseCase } from './application/use-cases/createBlogByAdmin.useCase';
import { GetBlogByIdUseCase } from './application/use-cases/getBlogById.useCase';
import { GetQueryBlogByIdUseCase } from './application/use-cases/getQueryBlogById.useCase';
import { UpdateBlogByAdminUseCase } from './application/use-cases/updateBlogByAdmin.useCase';
import { RemoveBlogByAdminUseCase } from './application/use-cases/removeBlogByAdmin.useCase';

const useCases = [
  GetAllQueryBlogsUseCase,
  CreateBlogByAdminUseCase,
  GetBlogByIdUseCase,
  GetQueryBlogByIdUseCase,
  UpdateBlogByAdminUseCase,
  RemoveBlogByAdminUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    CqrsModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BasicStrategy,
    ...useCases,
  ],
})
export class BlogModule {}
