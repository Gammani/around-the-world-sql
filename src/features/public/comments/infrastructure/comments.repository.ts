import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelStaticType,
} from '../domain/comments.entity';
import { Model } from 'mongoose';
import { CommentViewModel } from '../api/models/output/comment-output.model';
import { ObjectId } from 'mongodb';
import { CommentDbType, LikeStatus } from '../../../types';
import { CreatedCommentDtoType } from '../api/models/input/comment.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
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

  async createComment(
    createdCommentDto: CreatedCommentDtoType,
  ): Promise<CommentViewModel> {
    await this.dataSource.query(
      `INSERT INTO public."Comments"(
id, content, "createdAt", "userId", "postId", "blogId")
VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        createdCommentDto.id,
        createdCommentDto.content,
        createdCommentDto.createdAt,
        createdCommentDto.userId,
        createdCommentDto.postId,
        createdCommentDto.blogId,
      ],
    );
    console.log(createdCommentDto);
    return {
      id: createdCommentDto.id,
      content: createdCommentDto.content,
      commentatorInfo: {
        userId: createdCommentDto.userId,
        userLogin: createdCommentDto.userLogin,
      },
      createdAt: createdCommentDto.createdAt.toISOString(),
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
