import { Module } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { TestingRemoveAll } from './removeAll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/user.entity';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { Blog, BlogSchema } from '../blogs/domain/blogs.entity';
import { Post, PostSchema } from '../posts/domain/posts.entity';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { PostLikeRepository } from '../postLike/infrastructure/postLike.repository';
import { PostLike, PostLikeSchema } from '../postLike/domain/postLike.entity';
import { CommentLikeRepository } from '../commentLike/infrastructure/commentLike.repository';
import {
  CommentLike,
  CommentLikeSchema,
} from '../commentLike/domain/commentLike.entity';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { Comment, CommentSchema } from '../comments/domain/comments.entity';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import { PasswordAdapter } from '../adapter/password.adapter';

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
