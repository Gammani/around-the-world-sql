import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity';
import { BlogsController } from './api/blogs.controller';
import { BlogsQueryRepository } from './infrastructure/blogs.query.repository';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { GetAllQueryBlogsUseCase } from './application/use-cases/getAllQueryBlogs.useCase';
import { CreateBlogByAdminUseCase } from './application/use-cases/createBlogByAdmin.useCase';
import { GetBlogByIdUseCase } from './application/use-cases/getBlogByIdUseCase';
import { GetQueryBlogByIdUseCase } from './application/use-cases/getQueryBlogById.useCase';
import { UpdateBlogByAdminUseCase } from './application/use-cases/updateBlogByAdmin.useCase';
import { RemoveBlogByAdminUseCase } from './application/use-cases/removeBlogByAdmin.useCase';
import { Post, PostSchema } from '../../public/posts/domain/posts.entity';
import {
  PostLike,
  PostLikeSchema,
} from '../../public/postLike/domain/postLike.entity';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { PostModule } from '../../public/posts/post.module';

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
    PostModule,
    SharingModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository, ...useCases],
})
export class BlogSuperAdminModule {}
