import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import {
  CommentatorInfoType,
  CommentatorLikesInfoType,
  LikeStatus,
  PostDbType,
  UserDbType,
} from '../../types';
import { HydratedDocument, Model } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
class CommentatorInfo {
  @Prop({
    required: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
  })
  userLogin: string;
}

const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

@Schema()
class CommentatorLikesInfo {
  @Prop({
    required: true,
  })
  likesCount: number;

  @Prop({
    required: true,
  })
  dislikesCount: number;

  @Prop({
    required: true,
  })
  myStatus: LikeStatus;
}

const CommentatorLikesInfoSchema =
  SchemaFactory.createForClass(CommentatorLikesInfo);

@Schema()
export class Comment {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
    type: CommentatorInfoSchema,
  })
  commentatorInfo: CommentatorInfo;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  _postId: ObjectId;

  @Prop({
    required: true,
  })
  _blogId: ObjectId;

  @Prop({
    required: true,
    type: CommentatorLikesInfoSchema,
  })
  likesInfo: CommentatorLikesInfo;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.statics.createComment = (
  content: string,
  user: UserDbType,
  post: PostDbType,
  CommentModel: Model<CommentDocument> & CommentModelStaticType,
) => {
  const comment = new CommentModel();
  comment._id = new ObjectId();
  comment.content = content;
  comment.commentatorInfo = {
    userId: user._id,
    userLogin: user.accountData.login,
  };
  comment.createdAt = new Date().toISOString();
  comment._postId = post._id;
  comment._blogId = post.blogId;
  comment.likesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatus.None,
  };

  return comment;
};

export type CommentModelStaticType = {
  createComment: (
    content: string,
    user: UserDbType,
    post: PostDbType,
    CommentModel: Model<CommentDocument> & CommentModelStaticType,
  ) => {
    _id: ObjectId;
    content: string;
    commentatorInfo: CommentatorInfoType;
    createdAt: string;
    _postId: ObjectId;
    _blogId: ObjectId;
    likesInfo: CommentatorLikesInfoType;
  };
};
