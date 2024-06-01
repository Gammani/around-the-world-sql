import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comments.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  CommentLike,
  CommentLikeDocument,
} from '../../commentLike/domain/commentLike.entity';
import {
  CommentsWithPaginationViewModel,
  CommentViewModel,
} from '../api/models/output/comment-output.model';
import {
  CommentDbType,
  CommentLikeViewDbType,
  CommentViewDbModelType,
  CommentViewSqlDbModelType,
  LikeStatus,
} from '../../../types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(CommentLike.name)
    private CommentLikeModel: Model<CommentLikeDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findCommentById(
    id: string,
    userId?: ObjectId | string,
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
    userId?: string | null | undefined,
  ): Promise<CommentsWithPaginationViewModel> {
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const validSortFields = ['content', 'createdAt'];
    const sortBy =
      sortByQuery && validSortFields.includes(sortByQuery)
        ? `"${sortByQuery}"`
        : `"createdAt"`;
    const sortDirection = sortDirectionQuery === 'asc' ? 'asc' : 'desc';

    const offset = (pageNumber - 1) * pageSize;
    let totalCount: CommentViewDbModelType[];
    let pageCount;

    let items: CommentViewDbModelType[];

    if (postId) {
      totalCount = await this.getAllCommentViewDbModel(postId);
      pageCount = Math.ceil(totalCount.length / pageSize);
      items = await this.getCommentViewDbModel(
        sortBy,
        sortDirection,
        pageSize,
        offset,
        postId,
      );
    } else {
      totalCount = await this.getAllCommentViewDbModel();
      pageCount = Math.ceil(totalCount.length / pageSize);
      items = await this.getCommentViewDbModel(
        sortBy,
        sortDirection,
        pageSize,
        offset,
      );
    }

    // items = await this.CommentModel.find({
    //   _postId: new ObjectId(postId),
    // })
    //   .sort({ [sortBy]: sortDirection })
    //   .skip(offset)
    //   .limit(pageSize);
    // totalCount = await this.CommentModel.find({
    //   _postId: new ObjectId(postId),
    // }).countDocuments({});
    // pageCount = Math.ceil(totalCount / pageSize);

    const result = await Promise.all(
      items.map((item) => this.getLikeInfo(item, userId)),
    );

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount.length,
      items: result.map((r) => ({
        id: r.id,
        content: r.content,
        commentatorInfo: {
          userId: r.commentatorInfo.userId,
          userLogin: r.commentatorInfo.userLogin,
        },
        createdAt: r.createdAt.toISOString(),
        likesInfo: {
          likesCount: r.likesInfo.likesCount,
          dislikesCount: r.likesInfo.dislikesCount,
          myStatus: r.likesInfo.myStatus,
        },
      })),
    };
  }

  async getLikeInfo(
    comment: CommentViewDbModelType,
    userId?: ObjectId | string | null | undefined,
  ) {
    let myStatus: CommentLikeViewDbType | null = null;

    if (userId) {
      const foundCommentLike = await this.dataSource.query(
        `SELECT id, "userId", login, "blogId", "postId", "commentId", "likeStatus", "addedAt", "lastUpdate"
FROM public."CommentsLikes"
WHERE "commentId" = $1`,
        [comment.id],
      );
      myStatus = foundCommentLike.length > 0 ? foundCommentLike[0] : null;
    }

    const likesCount = await this.dataSource.query(
      `SELECT id, "userId", login, "blogId", "postId", "commentId", "likeStatus", "addedAt", "lastUpdate"
FROM public."CommentsLikes"
WHERE "likeStatus" = $1`,
      [LikeStatus.Like],
    );
    const dislikesCount = await this.dataSource.query(
      `SELECT id, "userId", login, "blogId", "postId", "commentId", "likeStatus", "addedAt", "lastUpdate"
FROM public."CommentsLikes"
WHERE "likeStatus" = $1`,
      [LikeStatus.Dislike],
    );
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: likesCount.length,
        dislikesCount: dislikesCount.length,
        myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None,
      },
    };
  }

  async getAllCommentViewDbModel(
    postId?: string,
  ): Promise<CommentViewDbModelType[]> {
    if (postId) {
      const items: CommentViewSqlDbModelType[] = await this.dataSource.query(
        `SELECT com.id, com.content, com."createdAt", com."userId", com."postId", com."blogId", "user".login as "userLogin"
FROM public."Comments" as com
LEFT JOIN public."UserAccountData" as "user" 
ON "user".id = com."userId"
WHERE "com"."postId" = $1`,
        [postId],
      );
      return items.map((i) => ({
        id: i.id,
        content: i.content,
        commentatorInfo: {
          userId: i.userId,
          userLogin: i.userLogin,
        },
        createdAt: i.createdAt,
        userId: i.userId,
        postId: i.postId,
        blogId: i.blogId,
      }));
    } else {
      const items: CommentViewSqlDbModelType[] = await this.dataSource.query(
        `SELECT com.id, com.content, com."createdAt", com."userId", com."postId", com."blogId", "user".login as "userLogin"
FROM public."Comments" as com
LEFT JOIN public."UserAccountData" as "user" 
ON "user".id = com."userId"`,
      );
      return items.map((i) => ({
        id: i.id,
        content: i.content,
        commentatorInfo: {
          userId: i.userId,
          userLogin: i.userLogin,
        },
        createdAt: i.createdAt,
        userId: i.userId,
        postId: i.postId,
        blogId: i.blogId,
      }));
    }
  }

  async getCommentViewDbModel(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    offset: number,
    postId?: string,
  ): Promise<CommentViewDbModelType[]> {
    if (postId) {
      const items: CommentViewSqlDbModelType[] = await this.dataSource.query(
        `SELECT com.id, com.content, com."createdAt", com."userId", com."postId", com."blogId", "user".login as "userLogin"
FROM public."Comments" as com
LEFT JOIN public."UserAccountData" as "user" 
ON "user".id = com."userId"
WHERE "com"."postId" = $1
ORDER BY ${sortBy} ${sortDirection}
  LIMIT $2 OFFSET $3`,
        [postId, pageSize, offset],
      );
      return items.map((i) => ({
        id: i.id,
        content: i.content,
        commentatorInfo: {
          userId: i.userId,
          userLogin: i.userLogin,
        },
        createdAt: i.createdAt,
        userId: i.userId,
        postId: i.postId,
        blogId: i.blogId,
      }));
    } else {
      const items: CommentViewSqlDbModelType[] = await this.dataSource.query(
        `SELECT com.id, com.content, com."createdAt", com."userId", com."postId", com."blogId", "user".login as "userLogin"
FROM public."Comments" as com
LEFT JOIN public."UserAccountData" as "user" 
ON "user".id = com."userId"
ORDER BY ${sortBy} ${sortDirection}
  LIMIT $2 OFFSET $3`,
        [pageSize, offset],
      );
      return items.map((i) => ({
        id: i.id,
        content: i.content,
        commentatorInfo: {
          userId: i.userId,
          userLogin: i.userLogin,
        },
        createdAt: i.createdAt,
        userId: i.userId,
        postId: i.postId,
        blogId: i.blogId,
      }));
    }
  }
}
