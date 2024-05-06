import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  PostLikeModelStaticType,
} from '../domain/postLike.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { LikeStatus, PostLikeDbType } from '../../types';

@Injectable()
export class PostLikeRepository {
  constructor(
    @InjectModel(PostLike.name)
    private PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType,
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

  async deleteAll() {
    await this.PostLikeModel.deleteMany({});
  }
}
