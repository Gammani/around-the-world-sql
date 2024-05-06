import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/posts.entity';
import { PostLike, PostLikeSchema } from '../postLike/domain/postLike.entity';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsController } from './api/posts.controller';
import { BlogsService } from '../blogs/application/blogs.service';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { Blog, BlogSchema } from '../blogs/domain/blogs.entity';
import {
  CommentLike,
  CommentLikeSchema,
} from '../commentLike/domain/commentLike.entity';
import { CommentsQueryRepository } from '../comments/infrastructure/comments.query.repository';
import { Comment, CommentSchema } from '../comments/domain/comments.entity';
import { PostsQueryRepository } from './infrastructure/posts.query.repository';
import { BlogIdIsExistConstraint } from '../../infrastructure/decorators/validate/blogId.isExist.decorator';
import { PostLikeRepository } from '../postLike/infrastructure/postLike.repository';
import { PostLikeService } from '../postLike/application/postLike.service';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';
import { PasswordAdapter } from '../adapter/password.adapter';
import { JwtService } from '../auth/application/jwt.service';
import { UsersService } from '../users/application/users.service';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { User, UserSchema } from '../users/domain/user.entity';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { EmailManager } from '../adapter/email.manager';
import { CommentsService } from '../comments/application/comments.service';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { CqrsModule } from '@nestjs/cqrs';
import { GetQueryPostsUseCase } from './application/use-cases/getQueryPosts.useCase';
import { CreatePostByAdminWithBlogIdUseCase } from './application/use-cases/createPostByAdminWithBlogId.useCase';
import { GetPostByIdUseCase } from './application/use-cases/getPostById.useCase';
import { CreatePostLikeUseCase } from '../postLike/application/use-cases/createPostLike-useCase';
import { GetPostLikeFromUserUseCase } from '../postLike/application/use-cases/getPostLikeFromUser.useCase';
import { UpdatePostLikeStatusUseCase } from '../postLike/application/use-cases/updatePostLikeStatus.useCase';
import { CreatePostByAdminUseCase } from './application/use-cases/createPostByAdmin.useCase';
import { GetQueryPostByIdUseCase } from './application/use-cases/getQueryPostById.useCase';
import { UpdatePostByAdminUseCase } from './application/use-cases/updatePostByAdmin.useCase';
import { DeletePostByAdminUseCase } from './application/use-cases/deletePostByAdmin.useCase';

const useCases = [
  GetQueryPostsUseCase,
  CreatePostByAdminWithBlogIdUseCase,
  GetPostByIdUseCase,
  CreatePostLikeUseCase,
  GetPostLikeFromUserUseCase,
  UpdatePostLikeStatusUseCase,
  CreatePostByAdminUseCase,
  GetQueryPostByIdUseCase,
  UpdatePostByAdminUseCase,
  DeletePostByAdminUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    ]),
    CqrsModule,
  ],
  controllers: [PostsController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    BlogIdIsExistConstraint,
    PostLikeRepository,
    PostLikeService,
    SecurityDevicesService,
    DeviceRepository,
    ExpiredTokenRepository,
    PasswordAdapter,
    JwtService,
    EmailManager,
    CommentsService,
    CommentsRepository,
    BasicAuthGuard,
    ...useCases,
  ],
})
export class PostModule {}
