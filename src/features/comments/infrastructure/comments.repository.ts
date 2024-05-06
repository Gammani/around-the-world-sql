import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelStaticType,
} from '../domain/comments.entity';
import { Model } from 'mongoose';
import { CommentDbType, LikeStatus } from '../../types';
import { CommentViewModel } from '../api/models/output/comment-output.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument> & CommentModelStaticType,
  ) {}

  async findCommentById(id: string): Promise<CommentDbType | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const foundComment: CommentDbType | null = await this.CommentModel.findOne({
      _id: id,
    });
    if (foundComment) {
      return foundComment;
    } else {
      return null;
    }
  }

  async createComment(createdCommentDto: any): Promise<CommentViewModel> {
    const newComment = await createdCommentDto.save();
    console.log(newComment);
    return {
      id: newComment._id.toString(),
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId.toString(),
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    };
  }

  async findCommentByPostId(postId: string) {
    return this.CommentModel.findOne({ _postId: postId });
  }
  async findCommentByContent(content: string) {
    return this.CommentModel.findOne({ content: content });
  }
  async updateComment(commentId: string, content: string): Promise<boolean> {
    const result = await this.CommentModel.updateOne(
      { _id: commentId },
      {
        $set: {
          content: content,
        },
      },
    );
    return result.matchedCount === 1;
  }
  async deleteComment(id: string): Promise<boolean> {
    const result = await this.CommentModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
  async deleteAll() {
    await this.CommentModel.deleteMany({});
    return;
  }
}
