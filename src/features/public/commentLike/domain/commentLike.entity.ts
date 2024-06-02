import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { CommentDbType, CommentViewDbType, LikeStatus } from '../../../types';

export type CommentLikeDocument = HydratedDocument<CommentLike>;

@Schema()
export class CommentLike {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
  })
  login: string;

  @Prop({
    required: true,
  })
  blogId: ObjectId;

  @Prop({
    required: true,
  })
  postId: ObjectId;

  @Prop({
    required: true,
  })
  commentId: ObjectId;

  @Prop({
    required: true,
  })
  likeStatus: LikeStatus;

  @Prop({
    required: true,
  })
  addedAt: string;

  @Prop({
    required: true,
  })
  lastUpdate: string;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);

CommentLikeSchema.statics.createCommentLike = (
  userId: ObjectId,
  login: string,
  comment: CommentDbType,
  likeStatus: LikeStatus,
  CommentLikeModel: Model<CommentLikeDocument> & CommentLikeModelStaticType,
) => {
  const commentLike = new CommentLikeModel();
  commentLike._id = new ObjectId();
  commentLike.userId = userId;
  commentLike.login = login;
  commentLike.blogId = comment._blogId;
  commentLike.postId = comment._postId;
  commentLike.commentId = comment._id;
  commentLike.likeStatus = likeStatus;
  commentLike.addedAt = new Date().toISOString();
  commentLike.lastUpdate = new Date().toISOString();

  return commentLike;
};

export type CommentLikeModelStaticType = {
  createCommentLike: (
    userId: string,
    login: string,
    comment: CommentViewDbType,
    likeStatus: LikeStatus,
    CommentLikeModel: Model<CommentLikeDocument> & CommentLikeModelStaticType,
  ) => {
    _id: ObjectId;
    userId: ObjectId;
    login: string;
    blogId: ObjectId;
    postId: ObjectId;
    commentId: ObjectId;
    likeStatus: LikeStatus;
    addedAt: string;
    lastUpdate: string;
  };
};
