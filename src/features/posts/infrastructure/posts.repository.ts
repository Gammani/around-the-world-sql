import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelWithUriBlogIdStaticType,
} from '../domain/posts.entity';
import { Model } from 'mongoose';
import { LikeStatus, PostDbType } from '../../types';
import { ObjectId } from 'mongodb';
import { PostViewModel } from '../api/models/output/post.output.model';
import { UpdateInputPostModelType } from '../api/models/input/post.input.model';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument & PostModelWithUriBlogIdStaticType>,
  ) {}

  async findPostById(postId: string): Promise<PostDbType | null> {
    if (!ObjectId.isValid(postId)) {
      return null;
    } else {
      return this.PostModel.findById(postId);
    }
  }

  async createPostByAdmin(createdPostDto: any): Promise<PostViewModel> {
    const newPost = await createdPostDto.save();

    return {
      id: newPost._id.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId.toString(),
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };
  }

  async updatePostByAdmin(
    postId: string,
    inputPostModel: UpdateInputPostModelType,
  ): Promise<boolean> {
    const result = await this.PostModel.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          title: inputPostModel.title,
          shortDescription: inputPostModel.shortDescription,
          content: inputPostModel.content,
          blogId: inputPostModel.blogId,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async deletePostById(postId: string): Promise<boolean> {
    if (!ObjectId.isValid(postId)) {
      throw new NotFoundException();
    }
    const result = await this.PostModel.deleteOne({
      _id: new ObjectId(postId),
    });
    return result.deletedCount === 1;
  }

  async deleteAllPostsByBlogId(blogId: string) {
    await this.PostModel.deleteMany({ blogId: new ObjectId(blogId) });
    return;
  }

  async deleteAll() {
    await this.PostModel.deleteMany({});
  }

  // for tests
  async findPostByTitle(postTitle: string) {
    return this.PostModel.findOne({ title: postTitle });
  }
}
