import { Injectable } from '@nestjs/common';
import {
  Blog,
  BlogDocument,
  BlogModelStaticType,
} from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { CreatedBlogViewModel } from '../api/models/output/blog.output.model';
import { BlogUpdateModel } from '../api/models/input/blog.input.model';
import { BlogDbType } from '../../../types';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: Model<BlogDocument> & BlogModelStaticType,
  ) {}

  async createBlogByAdmin(createdBlogDto: any): Promise<CreatedBlogViewModel> {
    const newBlog = await createdBlogDto.save();
    return {
      id: newBlog._id.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    };
  }

  async findBlogById(blogId: string): Promise<BlogDbType | null> {
    if (!ObjectId.isValid(blogId)) {
      return null;
    }
    return this.BlogModel.findById(blogId);
  }

  async updateBlogByAdmin(
    blogId: string,
    inputBlogModel: BlogUpdateModel,
  ): Promise<boolean> {
    const result = await this.BlogModel.updateOne(
      { _id: blogId },
      {
        $set: {
          name: inputBlogModel.name,
          description: inputBlogModel.description,
          websiteUrl: inputBlogModel.websiteUrl,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const result = await this.BlogModel.deleteOne({ _id: blogId });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    await this.BlogModel.deleteMany({});
  }
  // for tests
  async findBlogByName(blogName: string) {
    return this.BlogModel.findOne({ name: blogName });
  }
}
