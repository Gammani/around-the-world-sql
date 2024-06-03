import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  CommentLikeModelStaticType,
} from '../domain/commentLike.entity';
import { Model } from 'mongoose';
import {
  CommentLikeViewDbType,
  CreateCommentLikeDtoType,
  LikeStatus,
} from '../../../types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentLikeRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    // @InjectModel(CommentLike.name)
    // private CommentLikeModel: Model<CommentLikeDocument> &
    //   CommentLikeModelStaticType,
  ) {}

  async findLike(
    commentId: string,
    userId: string,
  ): Promise<CommentLikeViewDbType | null> {
    const foundLike: CommentLikeViewDbType[] = await this.dataSource.query(
      `SELECT id, "userId", login, "blogId", "postId", "commentId", "likeStatus", "addedAt", "lastUpdate"
FROM public."CommentsLikes"
WHERE "commentId" = $1 AND "userId" = $2`,
      [commentId, userId],
    );
    if (foundLike.length > 0) {
      return foundLike[0];
    } else {
      return null;
    }
  }

  async createCommentLike(createdCommentLikeDto: CreateCommentLikeDtoType) {
    await this.dataSource.query(
      `INSERT INTO public."CommentsLikes"(
id, "userId", login, "blogId", "postId", "commentId", "likeStatus", "addedAt", "lastUpdate")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        createdCommentLikeDto.id,
        createdCommentLikeDto.userId,
        createdCommentLikeDto.login,
        createdCommentLikeDto.blogId,
        createdCommentLikeDto.postId,
        createdCommentLikeDto.commentId,
        createdCommentLikeDto.likeStatus,
        createdCommentLikeDto.addedAt,
        createdCommentLikeDto.lastUpdate,
      ],
    );
    return;
  }

  async updateLikeStatus(
    likeStatus: LikeStatus,
    commentLike: CommentLikeViewDbType,
  ) {
    await this.dataSource.query(
      `UPDATE public."CommentsLikes"
SET "likeStatus" = $1
WHERE id = $2`,
      [likeStatus, commentLike.id],
    );
    return;
  }

  async getMyStatus(
    commentId: string,
    userId?: string,
  ): Promise<LikeStatus | null> {
    if (userId) {
      const myStatus = await this.dataSource.query(
        `SELECT id, "userId", login, "blogId", "postId", "commentId", "likeStatus", "addedAt", "lastUpdate"
FROM public."CommentsLikes"
WHERE "commentId" = $1 AND "userId" = $2`,
        [commentId, userId],
      );
      return myStatus[0].likeStatus;
    } else {
      return null;
    }
  }

  async getLikesCount(commentId: string): Promise<number> {
    const foundLikes = await this.dataSource.query(
      `SELECT id, "userId", login, "blogId", "postId", "commentId", "likeStatus", "addedAt", "lastUpdate"
FROM public."CommentsLikes"
WHERE "commentId" = $1 AND "likeStatus" = $2`,
      [commentId, LikeStatus.Like],
    );
    return foundLikes.length;
  }

  async getDislikesCount(commentId: string): Promise<number> {
    const foundLikes = await this.dataSource.query(
      `SELECT id, "userId", login, "blogId", "postId", "commentId", "likeStatus", "addedAt", "lastUpdate"
FROM public."CommentsLikes"
WHERE "commentId" = $1 AND "likeStatus" = $2`,
      [commentId, LikeStatus.Dislike],
    );
    return foundLikes.length;
  }

  async deleteCommentLikesByPostId(commentId: string) {
    return await this.dataSource.query(
      `DELETE FROM public."CommentsLikes"
WHERE "commentId" = $1`,
      [commentId],
    );
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."CommentsLikes"`);
  }
}
