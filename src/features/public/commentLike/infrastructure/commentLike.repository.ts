import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  CommentLikeModelStaticType,
} from '../domain/commentLike.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CommentLikeDbType, LikeStatus } from '../../../types';

@Injectable()
export class CommentLikeRepository {
  constructor(
    @InjectModel(CommentLike.name)
    private CommentLikeModel: Model<CommentLikeDocument> &
      CommentLikeModelStaticType,
  ) {}

  async findLike(
    commentId: ObjectId,
    userId: ObjectId,
  ): Promise<CommentLikeDbType | null> {
    const result = await this.CommentLikeModel.findOne({
      commentId: commentId,
      userId: userId,
    });
    if (result) {
      return result;
    }
    return null;
  }

  async createCommentLike(createdCommentLikeDto: any) {
    debugger;
    console.log(createdCommentLikeDto);
    await createdCommentLikeDto.save();
    return;
  }

  async updateLikeStatus(likeStatus: LikeStatus, like: CommentLikeDbType) {
    const result = await this.CommentLikeModel.updateOne(
      { _id: like._id },
      {
        $set: {
          likeStatus: likeStatus,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async deleteAll() {
    await this.CommentLikeModel.deleteMany({});
  }
}
