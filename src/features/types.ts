import { ObjectId } from 'mongodb';

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

type AccountDataType = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  recoveryCode: string;
};
type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};
export type UserDbType = {
  _id: ObjectId;
  accountData: AccountDataType;
  emailConfirmation: EmailConfirmationType;
};
export type UserDbViewModelType = {
  id: string;
  accountData: AccountDataType;
  emailConfirmation: EmailConfirmationType;
};
export type UserEmailDataSqlType = {
  id: string;
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
  userId: string;
};
export type UserAccountDataSqlType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  recoveryCode: string;
  expirationDatePasswordRecovery: Date;
};
export type UserViewEmailDbType = {
  userId: string;
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};
export type UserSqlDbType = {
  id: string;
  login: string;
  email: string;
};
export type DeviceDbType = {
  _id: ObjectId;
  userId: ObjectId;
  ip: string;
  deviceName: string;
  lastActiveDate: string;
};
export type DeviceViewDbType = {
  id: string;
  userId: string;
  ip: string;
  deviceName: string;
  lastActiveDate: string;
};
export type DeviceSqlDbType = {
  id: string;
  userId: string;
  ip: string;
  deviceName: string;
  lastActiveDate: string;
};
export type DeviceDbViewModelType = {
  id: string;
  userId: string;
  ip: string;
  deviceName: string;
  lastActiveDate: string;
};
export type TokenPayloadType = {
  deviceId: string;
  iat?: string;
  exp?: string;
};

type NewestLikesType = {
  addedAt: string;
  userId: ObjectId;
  login: string;
};
export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikesType[];
};
export type PostDbType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType;
};
export type PostViewDbType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type BlogDbType = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type BlogViewDbType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};
export type CommentatorLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};
export type CommentDbType = {
  _id: ObjectId;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  _postId: ObjectId;
  _blogId: ObjectId;
  likesInfo: CommentatorLikesInfoType;
};
export type CommentViewDbModelType = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
  userId: string;
  postId: string;
  blogId: string;
};
export type CommentViewSqlDbModelType = {
  id: string;
  content: string;
  userLogin: string;
  createdAt: Date;
  userId: string;
  postId: string;
  blogId: string;
};

export type PostLikeDbType = {
  _id: ObjectId;
  userId: ObjectId;
  login: string;
  blogId: ObjectId;
  postId: ObjectId;
  likeStatus: LikeStatus;
  addedAt: string;
  lastUpdate: string;
};
export type PostLikeViewDbType = {
  id: string;
  userId: string;
  login: string;
  blogId: string;
  postId: string;
  likeStatus: LikeStatus;
  addedAt: Date;
  lastUpdate: string;
};
export type CreatedPostLikeDtoType = {
  id: string;
  userId: string;
  login: string;
  post: PostViewDbType;
  likeStatus: LikeStatus;
  addedAt: Date;
  lastUpdate: Date;
};
export type CommentLikeDbType = {
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
export type CommentLikeViewDbType = {
  id: string;
  userId: string;
  login: string;
  blogId: string;
  postId: string;
  commentId: string;
  likeStatus: LikeStatus;
  addedAt: Date;
  lastUpdate: Date;
};
export type CreatedDeviceDtoModelType = {
  userId: string;
  ip: string;
  deviceName: string;
};
export type DeviceDtoModelType = {
  id: string;
  userId: string;
  ip: string;
  deviceName: string;
  lastActiveDate: string;
};
