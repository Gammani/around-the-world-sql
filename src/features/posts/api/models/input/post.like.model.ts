import { LikeStatus } from '../../../../types';
import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { LikeStatusIsValid } from '../../../../../infrastructure/decorators/validate/like.status.isValid.decorator';

export class PostLikeModel {
  @Trim()
  @LikeStatusIsValid()
  likeStatus: LikeStatus;
}
