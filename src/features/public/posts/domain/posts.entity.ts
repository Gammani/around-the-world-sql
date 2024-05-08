import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import {
  PostCreateModel,
  PostCreateModelWithBlogId,
} from '../api/models/input/post.input.model';
import { LikeStatus } from '../../../types';

export type PostDocument = HydratedDocument<Post>;

@Schema({ _id: false })
class NewestLikes {
  @Prop({
    required: true,
  })
  addedAt: string;

  @Prop({
    required: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
  })
  login: string;
}

const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);

@Schema({ _id: false })
class ExtendedLikesInfo {
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

  @Prop({
    required: true,
    type: [NewestLikesSchema],
  })
  newestLikes: NewestLikes[];
}

const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);

@Schema()
export class Post {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  shortDescription: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  blogId: ObjectId;

  @Prop({
    required: true,
  })
  blogName: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
    type: ExtendedLikesInfoSchema,
  })
  extendedLikesInfo: ExtendedLikesInfo;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.statics.createPostWithUriBlogId = (
  postInputDto: PostCreateModel,
  blogId: ObjectId,
  blogName: string,
  PostModel: Model<PostDocument> & PostModelWithUriBlogIdStaticType,
) => {
  const post = new PostModel();
  post._id = new ObjectId();
  post.title = postInputDto.title;
  post.shortDescription = postInputDto.shortDescription;
  post.content = postInputDto.content;
  post.blogId = blogId;
  post.blogName = blogName;
  post.createdAt = new Date().toISOString();
  post.extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatus.None,
    newestLikes: [],
  };
  return post;
};

PostSchema.statics.createPost = (
  postInputDto: PostCreateModelWithBlogId,
  blogName: string,
  PostModel: Model<PostDocument> & PostModelStaticType,
) => {
  const post = new PostModel();
  post._id = new ObjectId();
  post.title = postInputDto.title;
  post.shortDescription = postInputDto.shortDescription;
  post.content = postInputDto.content;
  post.blogId = new ObjectId(postInputDto.blogId);
  post.blogName = blogName;
  post.createdAt = new Date().toISOString();
  post.extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatus.None,
    newestLikes: [],
  };
  console.log(post);
  return post;
};

export type PostModelWithUriBlogIdStaticType = {
  createPostWithUriBlogId: (
    postInputDto: PostCreateModel,
    blogId: ObjectId,
    blogName: string,
    PostModel: Model<PostDocument> & PostModelWithUriBlogIdStaticType,
  ) => {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: ExtendedLikesInfo;
  };
};

export type PostModelStaticType = {
  createPost: (
    postInputDto: PostCreateModelWithBlogId,
    blogName: string,
    PostModel: Model<PostDocument> & PostModelStaticType,
  ) => {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: ExtendedLikesInfo;
  };
};
