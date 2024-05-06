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
  constructor(
    @InjectModel(PostLike.name)
    private PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType,
  ) {}
}
