// type CommentatorInfoType = {
//   userId: string;
//   userLogin: string;
// };
import { ObjectId } from 'mongodb';

export interface CheckDeviceId extends Request {
  deviceId?: ObjectId;
}

export type CreatedCommentDtoType = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  userLogin: string;
  postId: string;
  blogId: string;
};
