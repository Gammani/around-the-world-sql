import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  PostLikeModelStaticType,
} from '../domain/postLike.entity';
import { Model } from 'mongoose';

@Injectable()
export class PostLikeService {
  constructor() {} // private PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType, // @InjectModel(PostLike.name)
}
