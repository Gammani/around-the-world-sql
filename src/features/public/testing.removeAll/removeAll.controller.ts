import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { PostLikeRepository } from '../postLike/infrastructure/postLike.repository';
import { CommentLikeRepository } from '../commentLike/infrastructure/commentLike.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';

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
    // await this.blogRepository.deleteAll();
    // await this.postsRepository.deleteAll();
    // await this.commentsRepository.deleteAll();
    // await this.deviceRepository.deleteAll();
    // await this.postLikeRepository.deleteAll();
    // await this.commentLikeRepository.deleteAll();
    // await this.expiredTokenRepository.deleteAll();
    return;
  }
}
