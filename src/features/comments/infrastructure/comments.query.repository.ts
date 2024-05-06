import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comments.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  CommentLike,
  CommentLikeDocument,
} from '../../commentLike/domain/commentLike.entity';
import { CommentDbType, LikeStatus } from '../../types';
import {
  CommentsWithPaginationViewModel,
  CommentViewModel,
} from '../api/models/output/comment-output.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(CommentLike.name)
    private CommentLikeModel: Model<CommentLikeDocument>,
  ) {}

  async findCommentById(
    id: string,
    userId?: ObjectId,
  ): Promise<CommentViewModel | null> {
    const foundComment: CommentDbType | null = await this.CommentModel.findOne({
      _id: id,
    });

    if (foundComment) {
      const myStatus = await this.CommentLikeModel.findOne({
        commentId: foundComment._id,
        userId,
      });

      return {
        id: foundComment._id.toString(),
        content: foundComment.content,
        commentatorInfo: {
          userId: foundComment.commentatorInfo.userId,
          userLogin: foundComment.commentatorInfo.userLogin,
        },
        createdAt: foundComment.createdAt,
        likesInfo: {
          likesCount: await this.CommentLikeModel.find({
            commentId: foundComment._id,
            likeStatus: LikeStatus.Like,
          }).countDocuments({}),
          dislikesCount: await this.CommentLikeModel.find({
            commentId: foundComment._id,
            likeStatus: LikeStatus.Dislike,
          }).countDocuments({}),
          myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None,
        },
      };
    } else {
      return null;
    }
  }

  async findComments(
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
    postId: string,
    userId?: ObjectId | null | undefined,
  ): Promise<CommentsWithPaginationViewModel> {
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const sortBy = sortByQuery ? sortByQuery : 'createdAt';
    const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1;

    const skipPages: number = (pageNumber - 1) * pageSize;

    const items = await this.CommentModel.find({
      _postId: new ObjectId(postId),
    })
      .sort({ [sortBy]: sortDirection })
      .skip(skipPages)
      .limit(pageSize);
    const totalCount = await this.CommentModel.find({
      _postId: new ObjectId(postId),
    }).countDocuments({});
    const pageCount = Math.ceil(totalCount / pageSize);

    const result = await Promise.all(
      items.map((item) => this.getLikeInfo(item, userId)),
    );

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: result.map((r) => ({
        id: r.id,
        content: r.content,
        commentatorInfo: {
          userId: r.commentatorInfo.userId.toString(),
          userLogin: r.commentatorInfo.userLogin,
        },
        createdAt: r.createdAt,
        likesInfo: {
          likesCount: r.likesInfo.likesCount,
          dislikesCount: r.likesInfo.dislikesCount,
          myStatus: r.likesInfo.myStatus,
        },
      })),
    };
  }

  async getLikeInfo(
    comment: CommentDocument,
    userId?: ObjectId | null | undefined,
  ) {
    let myStatus: CommentLikeDocument | null = null;

    if (userId) {
      myStatus = await this.CommentLikeModel.findOne({
        commentId: comment._id,
        userId,
      });
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: await this.CommentLikeModel.find({
          commentId: comment._id,
          likeStatus: LikeStatus.Like,
        }).countDocuments({}),
        dislikesCount: await this.CommentLikeModel.find({
          commentId: comment._id,
          likeStatus: LikeStatus.Dislike,
        }).countDocuments({}),
        myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None,
      },
    };
  }
}
