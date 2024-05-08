import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  BlogModelStaticType,
} from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { BlogDbType } from '../../../types';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,

    @InjectModel(Blog.name)
    private BlogModel: Model<BlogDocument> & BlogModelStaticType,
  ) {}

  async findBlogById(blogId: string): Promise<BlogDbType | null> {
    return await this.blogsRepository.findBlogById(blogId);
  }

  async removeBlogByAdmin(blogId: string): Promise<boolean> {
    await this.postsRepository.deleteAllPostsByBlogId(blogId);
    return await this.blogsRepository.deleteBlog(blogId);
  }
}
