import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  PostLikeModelStaticType,
} from '../domain/postLike.entity';
import { Model } from 'mongoose';
import {
  CreatedPostLikeDtoType,
  LikeStatus,
  PostLikeViewDbType,
} from '../../../types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostLikeRepository {
  constructor(
    @InjectModel(PostLike.name)
    private PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findPostLike(
    postId: string,
    userId: string,
  ): Promise<PostLikeViewDbType | null> {
    const result = await this.dataSource.query(
      `SELECT id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate"
FROM public."PostLike"
WHERE "postId" = $1 AND "userId" = $2;`,
      [postId, userId],
    );
    if (result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }

  async createPostLike(createdPostLikeDto: CreatedPostLikeDtoType) {
    await this.dataSource.query(
      `INSERT INTO public."PostLike"(
id, "userId", "blogId", "postId", login, "likeStatus", "addedAt", "lastUpdate")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        createdPostLikeDto.id,
        createdPostLikeDto.userId,
        createdPostLikeDto.post.blogId,
        createdPostLikeDto.post.id,
        createdPostLikeDto.login,
        createdPostLikeDto.likeStatus,
        createdPostLikeDto.addedAt,
        createdPostLikeDto.lastUpdate,
      ],
    );
    return;
  }

  async updatePostLikeStatus(
    likeStatus: LikeStatus,
    postLike: PostLikeViewDbType,
  ): Promise<boolean> {
    const date = new Date();
    try {
      await this.dataSource.query(
        `UPDATE public."PostLike"
SET "likeStatus" = $1, "lastUpdate"= $2
WHERE id = $3`,
        [likeStatus, date, postLike.id],
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deletePostLikesByPostId(postId: string) {
    return await this.dataSource.query(
      `DELETE FROM public."PostLike"
WHERE "postId" = $1`,
      [postId],
    );
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."PostLike"`);
  }
}
