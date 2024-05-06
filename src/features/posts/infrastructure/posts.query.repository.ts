import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { LikeStatus } from '../../types';
import {
  PostLike,
  PostLikeDocument,
} from '../../postLike/domain/postLike.entity';
import { ObjectId } from 'mongodb';
import {
  customFilteredPostLikesType,
  PostsWithPaginationViewModel,
  PostViewModel,
} from '../api/models/output/post.output.model';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(PostLike.name) private PostLikeModel: Model<PostLikeDocument>,
  ) {}

  async findPosts(
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
    userId?: ObjectId | null | undefined,
    blogId?: string,
  ): Promise<PostsWithPaginationViewModel> {
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const sortBy = sortByQuery ? sortByQuery : 'createdAt';
    const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1;

    const skipPages: number = (pageNumber - 1) * pageSize;

    // const totalCount = await PostModel.find({}).count({})
    // const pageCount = Math.ceil(totalCount / pageSize)
    let totalCount;
    let pageCount;

    let items: PostDocument[];

    if (blogId) {
      totalCount = await this.PostModel.find({
        blogId: new ObjectId(blogId),
      }).countDocuments({});
      pageCount = Math.ceil(totalCount / pageSize);
      items = await this.PostModel.find({ blogId: new ObjectId(blogId) })
        .sort({ [sortBy]: sortDirection })
        .skip(skipPages)
        .limit(pageSize);
    } else {
      totalCount = await this.PostModel.find({}).countDocuments({});
      pageCount = Math.ceil(totalCount / pageSize);
      items = await this.PostModel.find({})
        .sort({ [sortBy]: sortDirection })
        .skip(skipPages)
        .limit(pageSize);
    }

    const result = await Promise.all(
      items.map((item) => this.getExtendedLikesInfo(item, userId)),
    );
    const filteredResult = result.filter(
      (r) => r !== undefined,
    ) as customFilteredPostLikesType[];

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filteredResult.map((r) => ({
        id: r.id.toString(),
        title: r.title,
        shortDescription: r.shortDescription,
        content: r.content,
        blogId: r.blogId,
        blogName: r.blogName,
        createdAt: r.createdAt,
        extendedLikesInfo: {
          likesCount: r.extendedLikesInfo.likesCount,
          dislikesCount: r.extendedLikesInfo.dislikesCount,
          myStatus: r.extendedLikesInfo.myStatus,
          newestLikes: r.extendedLikesInfo.newestLikes,
        },
      })),
    };
  }

  async getExtendedLikesInfo(
    post: PostDocument,
    userId?: ObjectId | null | undefined,
  ): Promise<customFilteredPostLikesType | undefined> {
    try {
      let myStatus: PostLikeDocument | null = null;

      if (userId) {
        myStatus = await this.PostLikeModel.findOne({
          postId: post._id,
          userId,
        });
      }

      const newestLikes = await this.PostLikeModel.find({
        postId: post._id,
        likeStatus: LikeStatus.Like,
      })
        .sort({ createdAt: -1, _id: -1 })
        .limit(3);
      const likesCount = await this.PostLikeModel.find({
        postId: post._id,
        likeStatus: LikeStatus.Like,
      }).countDocuments({});
      const dislikesCount = await this.PostLikeModel.find({
        postId: post._id,
        likeStatus: LikeStatus.Dislike,
      })
        .countDocuments({})
        .exec();

      // .countDocuments
      // const likesCount = await PostLikeModel.countDocuments({ postId: post._id, likeStatus: LikeStatus.Like }).exec()
      // const dislikesCount = await PostLikeModel.countDocuments({ postId: post._id, likeStatus: LikeStatus.Dislike }).exec()

      const newestLikesInfo = newestLikes.map((nl: PostLikeDocument) => ({
        addedAt: nl.addedAt.toString(),
        userId: nl.userId.toString(),
        login: nl.login,
      }));

      return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None,
          newestLikes: newestLikesInfo,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findPostById(
    postId: string,
    userId?: ObjectId | null | undefined,
  ): Promise<PostViewModel | null> {
    if (!ObjectId.isValid(postId)) {
      throw new NotFoundException();
    }
    const foundPost = await this.PostModel.findById(postId);
    if (foundPost) {
      const likesCount = await this.PostLikeModel.find({
        postId: new ObjectId(postId),
        likeStatus: LikeStatus.Like,
      }).countDocuments({});
      const dislikesCount = await this.PostLikeModel.find({
        postId: new ObjectId(postId),
        likeStatus: LikeStatus.Dislike,
      }).countDocuments({});
      const myStatus = await this.PostLikeModel.findOne({
        postId: new ObjectId(postId),
        userId,
      });
      const newestLikes = await this.PostLikeModel.find({
        postId: new ObjectId(postId),
        likeStatus: LikeStatus.Like,
      })
        .sort({ createdAt: -1, _id: -1 })
        .limit(3);

      return {
        id: foundPost._id.toString(),
        title: foundPost.title,
        shortDescription: foundPost.shortDescription,
        content: foundPost.content,
        blogId: foundPost.blogId.toString(),
        blogName: foundPost.blogName,
        createdAt: foundPost.createdAt,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None,
          newestLikes: newestLikes.map((nl) => ({
            addedAt: nl.addedAt.toString(),
            userId: nl.userId.toString(),
            login: nl.login,
          })),
        },
      };
    } else {
      return null;
    }
  }
}
