import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelStaticType,
} from '../domain/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument> & CommentModelStaticType,
  ) {}
}
