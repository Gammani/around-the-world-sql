import { Module } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { TestingRemoveAll } from './removeAll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/user.entity';
import { Blog, BlogSchema } from '../../public/blogs/domain/blogs.entity';
import { Post, PostSchema } from '../../public/posts/domain/posts.entity';
import {
  Comment,
  CommentSchema,
} from '../../public/comments/domain/comments.entity';
import {
  Device,
  DeviceSchema,
} from '../../public/devices/domain/devices.entity';
import {
  PostLike,
  PostLikeSchema,
} from '../../public/postLike/domain/postLike.entity';
import {
  CommentLike,
  CommentLikeSchema,
} from '../../public/commentLike/domain/commentLike.entity';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../../public/expiredToken/domain/expired-token.entity';
import { BlogsRepository } from '../../public/blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../public/posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../public/comments/infrastructure/comments.repository';
import { DeviceRepository } from '../../public/devices/infrastructure/device.repository';
import { PostLikeRepository } from '../../public/postLike/infrastructure/postLike.repository';
import { CommentLikeRepository } from '../../public/commentLike/infrastructure/commentLike.repository';
import { ExpiredTokenRepository } from '../../public/expiredToken/infrastructure/expired.token.repository';
import { PasswordAdapter } from '../../adapter/password.adapter';

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
