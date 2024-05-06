import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { LikeStatus, PostDbType } from '../../types';
import { HydratedDocument, Model } from 'mongoose';

export type PostLikeDocument = HydratedDocument<PostLike>;

@Schema()
export class PostLike {
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

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

PostLikeSchema.statics.createPostLike = (
  userId: ObjectId,
  login: string,
  post: PostDbType,
  likeStatus: LikeStatus,
  PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType,
) => {
  const postLike = new PostLikeModel();
  postLike._id = new ObjectId();
  postLike.userId = userId;
  postLike.login = login;
  postLike.blogId = post.blogId;
  postLike.postId = post._id;
  postLike.likeStatus = likeStatus;
  postLike.addedAt = new Date().toISOString();
  postLike.lastUpdate = new Date().toISOString();

  return postLike;
};

export type PostLikeModelStaticType = {
  createPostLike: (
    userId: ObjectId,
    login: string,
    post: PostDbType,
    likeStatus: LikeStatus,
    PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType,
  ) => {
    _id: ObjectId;
    userId: ObjectId;
    login: string;
    blogId: ObjectId;
    postId: ObjectId;
    likeStatus: LikeStatus;
    addedAt: string;
    lastUpdate: string;
  };
};
