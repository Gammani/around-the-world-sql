import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import {
  PostLike,
  PostLikeDocument,
} from '../../postLike/domain/postLike.entity';
import {
  customFilteredPostLikesType,
  PostsWithPaginationViewModel,
  PostViewModel,
} from '../api/models/output/post.output.model';
import { LikeStatus, PostLikeViewDbType, PostViewDbType } from '../../../types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(
    // @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    // @InjectModel(PostLike.name) private PostLikeModel: Model<PostLikeDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findPosts(
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
    userId?: string | null | undefined,
    blogId?: string,
  ): Promise<PostsWithPaginationViewModel> {
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const validSortFields = [
      'id',
      'title',
      'shortDescription',
      'content',
      'blogId',
      'blogName',
      'createdAt',
    ];
    const sortBy =
      sortByQuery && validSortFields.includes(sortByQuery)
        ? `"${sortByQuery}"`
        : `"createdAt"`;
    const sortDirection = sortDirectionQuery === 'asc' ? 'asc' : 'desc';

    const offset = (pageNumber - 1) * pageSize;
    let totalCount;
    let pageCount;

    let items: PostViewDbType[];

    if (blogId) {
      totalCount = await this.dataSource.query(
        `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
FROM public."Posts"
WHERE "blogId" = $1`,
        [blogId],
      );
      pageCount = Math.ceil(totalCount.length / pageSize);
      items = await this.dataSource.query(
        `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
FROM public."Posts"
WHERE "blogId" = $1
ORDER BY ${sortBy} ${sortDirection}
  LIMIT $2 OFFSET $3`,
        [blogId, pageSize, offset],
      );
    } else {
      totalCount = await this.dataSource
        .query(`SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
FROM public."Posts"`);
      pageCount = Math.ceil(totalCount.length / pageSize);
      items = await this.dataSource.query(
        `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
      FROM public."Posts"
      ORDER BY ${sortBy} ${sortDirection}
        LIMIT $1 OFFSET $2`,
        [pageSize, offset],
      );
    }
    const result = await Promise.all(
      items.map((item) => this.getExtendedLikesInfo(item, userId)),
    );
    const filteredResult = result.filter(
      (r) => r !== undefined,
    ) as customFilteredPostLikesType[];

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount.length,
      items: filteredResult.map((r) => ({
        id: r.id.toString(),
        title: r.title,
        shortDescription: r.shortDescription,
        content: r.content,
        blogId: r.blogId,
        blogName: r.blogName,
        createdAt: r.createdAt,
        extendedLikesInfo: {
          likesCount: r.extendedLikesInfo.likesCount,
          dislikesCount: r.extendedLikesInfo.dislikesCount,
          myStatus: r.extendedLikesInfo.myStatus,
          newestLikes: r.extendedLikesInfo.newestLikes,
        },
      })),
    };
  }

  async getExtendedLikesInfo(
    post: PostViewDbType,
    userId?: string | null | undefined,
  ): Promise<customFilteredPostLikesType | undefined> {
    try {
      let myStatus: PostLikeViewDbType | null = null;
      if (userId) {
        myStatus = await this.dataSource.query(
          `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
FROM public."PostLike"
WHERE "postId"=$1 AND "userId"=$2`,
          [post.id, userId],
        );
      }
      const newestLikes: PostLikeViewDbType[] = await this.dataSource.query(
        `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
FROM public."PostLike"
WHERE "postId" = $1 AND "likeStatus" = $2
ORDER BY "addedAt" DESC, id DESC
LIMIT 3;`,
        [post.id, LikeStatus.Like],
      );
      const likes: PostLikeViewDbType[] = await this.dataSource.query(
        `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
FROM public."PostLike"
WHERE "postId" = $1 AND "likeStatus" = $2`,
        [post.id, LikeStatus.Like],
      );
      const likesCount = likes.length;

      const dislikes: PostLikeViewDbType[] = await this.dataSource.query(
        `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
FROM public."PostLike"
WHERE "postId" = $1 AND "likeStatus" = $2`,
        [post.id, LikeStatus.Dislike],
      );
      const dislikesCount = dislikes.length;

      const newestLikesInfo = newestLikes.map((nl: PostLikeViewDbType) => ({
        addedAt: nl.addedAt.toISOString(),
        userId: nl.userId,
        login: nl.login,
      }));

      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: myStatus?.[0] ? myStatus[0].likeStatus : LikeStatus.None,
          newestLikes: newestLikesInfo,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findPostById(
    post: PostViewDbType,
    userId?: string | null | undefined,
  ): Promise<PostViewModel | null> {
    const postViewModel: customFilteredPostLikesType | undefined =
      await this.getExtendedLikesInfo(post, userId);
    if (postViewModel) {
      return {
        id: postViewModel.id,
        title: postViewModel.title,
        shortDescription: postViewModel.shortDescription,
        content: postViewModel.content,
        blogId: postViewModel.blogId,
        blogName: postViewModel.blogName,
        createdAt: postViewModel.createdAt,
        extendedLikesInfo: {
          likesCount: postViewModel.extendedLikesInfo.likesCount,
          dislikesCount: postViewModel.extendedLikesInfo.dislikesCount,
          myStatus: postViewModel.extendedLikesInfo.myStatus,
          newestLikes: postViewModel.extendedLikesInfo.newestLikes,
        },
      };
    } else {
      return null;
    }
  }
}
