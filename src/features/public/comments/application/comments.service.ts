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
  constructor() {} // private CommentModel: Model<CommentDocument> & CommentModelStaticType, // @InjectModel(Comment.name)
}
