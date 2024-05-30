import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  PostLikeModelStaticType,
} from '../domain/postLike.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { LikeStatus, PostLikeDbType } from '../../../types';
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
    postId: ObjectId,
    userId: ObjectId,
  ): Promise<PostLikeDbType | null> {
    const result = await this.PostLikeModel.findOne({
      postId: postId,
      userId: userId,
    });
    if (result) {
      return result;
    } else {
      return null;
    }
  }

  async createPostLike(createdPostLikeDto: any) {
    await createdPostLikeDto.save();
    return;
  }

  async updatePostLikeStatus(likeStatus: LikeStatus, like: PostLikeDbType) {
    const result = await this.PostLikeModel.updateOne(
      { _id: like._id },
      {
        $set: {
          likeStatus: likeStatus,
          lastUpdate: new Date().toString(),
        },
      },
    );
    return result.matchedCount === 1;
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
