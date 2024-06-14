import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/posts.entity';
import { PostLike, PostLikeSchema } from '../postLike/domain/postLike.entity';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsController } from './api/posts.controller';
import {
  CommentLike,
  CommentLikeSchema,
} from '../commentLike/domain/commentLike.entity';
import { CommentsQueryRepository } from '../comments/infrastructure/comments.query.repository';
import { Comment, CommentSchema } from '../comments/domain/comments.entity';
import { PostsQueryRepository } from './infrastructure/posts.query.repository';
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
import { JwtService } from '../auth/application/jwt.service';
import { CommentsService } from '../comments/application/comments.service';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { GetQueryPostsUseCase } from './application/use-cases/getQueryPostsUseCase';
import { CreatePostByAdminWithBlogIdUseCase } from './application/use-cases/createPostByAdminWithBlogId.useCase';
import { GetPostByIdUseCase } from './application/use-cases/getPostById.useCase';
import { CreatePostLikeUseCase } from '../postLike/application/use-cases/createPostLike-useCase';
import { GetPostLikeFromUserUseCase } from '../postLike/application/use-cases/getPostLikeFromUser.useCase';
import { UpdatePostLikeStatusUseCase } from '../postLike/application/use-cases/updatePostLikeStatus.useCase';
import { CreatePostByAdminUseCase } from './application/use-cases/createPostByAdmin.useCase';
import { GetQueryPostByIdUseCase } from './application/use-cases/getQueryPostById.useCase';
import { UpdatePostByAdminUseCase } from './application/use-cases/updatePostByAdmin.useCase';
import { DeletePostByAdminUseCase } from './application/use-cases/deletePostByAdmin.useCase';
import { UsersService } from '../../super-admin/users/application/users.service';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../super-admin/users/infrastructure/users.query.repository';
import { BlogIdIsExistConstraint } from '../../../infrastructure/decorators/validate/blogId.isExist.decorator';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { EmailManager } from '../../adapter/email.manager';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';
import { BlogsService } from '../../super-admin/blogs/application/blogs.service';
import { BlogsRepository } from '../../super-admin/blogs/infrastructure/blogs.repository';

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

@Global()
@Module({
  imports: [SharingModule],
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
    ...useCases,
  ],
  exports: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    // MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
})
export class PostModule {}
