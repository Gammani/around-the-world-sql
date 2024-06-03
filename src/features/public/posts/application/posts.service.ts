import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelStaticType,
  PostModelWithUriBlogIdStaticType,
} from '../domain/posts.entity';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor() {} //   PostModelStaticType, //   PostModelWithUriBlogIdStaticType & // private PostModel: Model<PostDocument> & // @InjectModel(Post.name)
}
