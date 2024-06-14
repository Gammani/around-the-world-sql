import { Module } from '@nestjs/common';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { TestingRemoveAll } from './removeAll.controller';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { PostLikeRepository } from '../postLike/infrastructure/postLike.repository';
import { CommentLikeRepository } from '../commentLike/infrastructure/commentLike.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { BlogsRepository } from '../../super-admin/blogs/infrastructure/blogs.repository';
import { SharingModule } from '../../../settings/sharingModules/sharingModule';

@Module({
  imports: [SharingModule],
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
