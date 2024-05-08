import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { LikeStatusIsValid } from '../../../../../../infrastructure/decorators/validate/like.status.isValid.decorator';
import { LikeStatus } from '../../../../../types';

export class PostLikeModel {
  @Trim()
  @LikeStatusIsValid()
  likeStatus: LikeStatus;
}
