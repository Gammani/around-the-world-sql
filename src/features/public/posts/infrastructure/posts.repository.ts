import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelWithUriBlogIdStaticType,
} from '../domain/posts.entity';
import { Model } from 'mongoose';
import { PostViewModel } from '../api/models/output/post.output.model';
import {
  CreatedPostDtoType,
  UpdateInputPostModelType,
} from '../api/models/input/post.input.model';
import { LikeStatus, PostViewDbType } from '../../../types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument & PostModelWithUriBlogIdStaticType>,
  ) {}

  async findPostById(postId: string): Promise<PostViewDbType | null> {
    if (validateUUID(postId)) {
      const foundPost = await this.dataSource.query(
        `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt"
FROM public."Posts"
WHERE id = $1`,
        [postId],
      );
      if (foundPost.length > 0) {
        return foundPost[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async createPostByAdmin(
    createdPostDto: CreatedPostDtoType,
  ): Promise<PostViewModel> {
    await this.dataSource.query(
      `INSERT INTO public."Posts"(
id, title, "shortDescription", content, "blogId", "blogName", "createdAt")
VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        createdPostDto.id,
        createdPostDto.title,
        createdPostDto.shortDescription,
        createdPostDto.content,
        createdPostDto.blogId,
        createdPostDto.blogName,
        createdPostDto.createdAt,
      ],
    );

    return {
      id: createdPostDto.id,
      title: createdPostDto.title,
      shortDescription: createdPostDto.shortDescription,
      content: createdPostDto.content,
      blogId: createdPostDto.blogId,
      blogName: createdPostDto.blogName,
      createdAt: createdPostDto.createdAt.toISOString(),
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
    blogId: string,
    inputPostModel: UpdateInputPostModelType,
  ): Promise<boolean> {
    try {
      await this.dataSource.query(
        `UPDATE public."Posts"
SET title=$1, "shortDescription"=$2, content=$3, "blogId"=$4
WHERE id = $5`,
        [
          inputPostModel.title,
          inputPostModel.shortDescription,
          inputPostModel.content,
          blogId,
          postId,
        ],
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deletePostById(postId: string): Promise<boolean> {
    try {
      await this.dataSource.query(
        `DELETE FROM public."Posts"
WHERE id = $1`,
        [postId],
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteAllPostsByBlogId(blogId: string) {
    await this.dataSource.query(
      `DELETE FROM public."Posts"
WHERE "blogId" = $1`,
      [blogId],
    );
    return;
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."Posts"`);
  }

  // for tests
  async findPostByTitle(postTitle: string) {
    return this.PostModel.findOne({ title: postTitle });
  }
}
