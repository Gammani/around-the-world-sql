// type CommentatorInfoType = {
//   userId: string;
//   userLogin: string;
// };
import { ObjectId } from 'mongodb';

export interface CheckDeviceId extends Request {
  deviceId?: ObjectId;
}
