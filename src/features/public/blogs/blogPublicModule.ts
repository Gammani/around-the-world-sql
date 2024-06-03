import { GetAllQueryBlogsUseCase } from './application/use-cases/getAllQueryBlogs.useCase';
import { CreateBlogByAdminUseCase } from '../../super-admin/blogs/application/use-cases/createBlogByAdmin.useCase';
import { GetBlogByIdUseCase } from './application/use-cases/getBlogById.useCase';
import { GetQueryBlogByIdUseCase } from './application/use-cases/getQueryBlogById.useCase';
import { UpdateBlogByAdminUseCase } from '../../super-admin/blogs/application/use-cases/updateBlogByAdmin.useCase';
import { RemoveBlogByAdminUseCase } from '../../super-admin/blogs/application/use-cases/removeBlogByAdmin.useCase';
import { Module, Post } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../../super-admin/blogs/domain/blogs.entity';
import { PostLike, PostLikeSchema } from '../postLike/domain/postLike.entity';
import { PostSchema } from '../posts/domain/posts.entity';
import { PostModule } from '../posts/post.module';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from '../../super-admin/blogs/application/blogs.service';
import { BlogsRepository } from '../../super-admin/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../super-admin/blogs/infrastructure/blogs.query.repository';

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
    // MongooseModule.forFeature([
    //   { name: Blog.name, schema: BlogSchema },
    //   { name: Post.name, schema: PostSchema },
    //   { name: PostLike.name, schema: PostLikeSchema },
    // ]),
    PostModule,
    SharingModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository, ...useCases],
})
export class BlogPublicModule {}
