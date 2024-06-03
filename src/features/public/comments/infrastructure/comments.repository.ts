import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelStaticType,
} from '../domain/comments.entity';
import { Model } from 'mongoose';
import { CommentViewModel } from '../api/models/output/comment-output.model';
import { CommentViewDbType, LikeStatus } from '../../../types';
import { CreatedCommentDtoType } from '../api/models/input/comment.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    // @InjectModel(Comment.name)
    // private CommentModel: Model<CommentDocument> & CommentModelStaticType,
  ) {}

  async findCommentById(commentId: string): Promise<CommentViewDbType | null> {
    if (validateUUID(commentId)) {
      const foundComment = await this.dataSource.query(
        `SELECT com.id, com.content, com."createdAt", com."userId", com."postId", com."blogId", "user".login as "userLogin"
FROM public."Comments" as com
LEFT JOIN public."UserAccountData" as "user" 
ON "user".id = com."userId"
WHERE "com"."id" = $1`,
        [commentId],
      );
      if (foundComment.length > 0) {
        return {
          id: foundComment[0].id,
          content: foundComment[0].content,
          createdAt: foundComment[0].createdAt,
          commentatorInfo: {
            userId: foundComment[0].userId,
            userLogin: foundComment[0].userLogin,
          },
          postId: foundComment[0].postId,
          blogId: foundComment[0].blogId,
        };
      } else {
        return null;
      }
    }
    return null;
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

  // async findCommentByPostId(postId: string) {
  //   return this.CommentModel.findOne({ _postId: postId });
  // }
  // async findCommentByContent(content: string) {
  //   return this.CommentModel.findOne({ content: content });
  // }
  async updateComment(commentId: string, content: string): Promise<boolean> {
    try {
      await this.dataSource.query(
        `UPDATE public."Comments"
SET content = $1
WHERE id = $2`,
        [content, commentId],
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deleteComment(commentId: string): Promise<boolean> {
    return await this.dataSource.query(
      `DELETE FROM public."Comments"
WHERE id = $1`,
      [commentId],
    );
  }
  async deleteAll() {
    return await this.dataSource.query(`DELETE FROM public."Comments"`);
  }
}
