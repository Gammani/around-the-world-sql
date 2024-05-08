import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { BlogsRepository } from '../../public/blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../public/posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../public/comments/infrastructure/comments.repository';
import { DeviceRepository } from '../../public/devices/infrastructure/device.repository';
import { PostLikeRepository } from '../../public/postLike/infrastructure/postLike.repository';
import { CommentLikeRepository } from '../../public/commentLike/infrastructure/commentLike.repository';
import { ExpiredTokenRepository } from '../../public/expiredToken/infrastructure/expired.token.repository';

@Controller('testing/all-data')
export class TestingRemoveAll {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly blogRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly deviceRepository: DeviceRepository,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly commentLikeRepository: CommentLikeRepository,
    private readonly expiredTokenRepository: ExpiredTokenRepository,
  ) {}

  @HttpCode(204)
  @Delete()
  async removeAllData() {
    await this.usersRepository.deleteAll();
    await this.blogRepository.deleteAll();
    await this.postsRepository.deleteAll();
    await this.commentsRepository.deleteAll();
    await this.deviceRepository.deleteAll();
    await this.postLikeRepository.deleteAll();
    await this.commentLikeRepository.deleteAll();
    await this.expiredTokenRepository.deleteAll();
    return;
  }
}
