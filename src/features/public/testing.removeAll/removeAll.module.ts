import { Module } from '@nestjs/common';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { TestingRemoveAll } from './removeAll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../super-admin/users/domain/user.entity';
import { Post, PostSchema } from '../posts/domain/posts.entity';
import { Comment, CommentSchema } from '../comments/domain/comments.entity';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { PostLike, PostLikeSchema } from '../postLike/domain/postLike.entity';
import {
  CommentLike,
  CommentLikeSchema,
} from '../commentLike/domain/commentLike.entity';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { PostLikeRepository } from '../postLike/infrastructure/postLike.repository';
import { CommentLikeRepository } from '../commentLike/infrastructure/commentLike.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { Blog, BlogSchema } from '../../super-admin/blogs/domain/blogs.entity';
import { BlogsRepository } from '../../super-admin/blogs/infrastructure/blogs.repository';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    ]),
    SharingModule,
  ],
  controllers: [TestingRemoveAll],
  providers: [
    UsersRepository,
    BlogsRepository,
    PostsRepository,
    CommentsRepository,
    DeviceRepository,
    PostLikeRepository,
    CommentLikeRepository,
    ExpiredTokenRepository,
    PasswordAdapter,
  ],
})
export class RemoveAllModule {}
