import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { LikeStatus } from '../../../../types';
import { LikeStatusIsValid } from '../../../../../infrastructure/decorators/validate/like.status.isValid.decorator';

export class CommentLikeModel {
  @Trim()
  @LikeStatusIsValid()
  likeStatus: LikeStatus;
}
