import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CommentInputModel {
  @Trim()
  @IsString()
  @Length(20, 300)
  @IsNotEmpty()
  content: string;
}
