import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';

export class CommentInputModel {
  @Trim()
  @IsString()
  @Length(20, 300)
  @IsNotEmpty()
  content: string;
}
