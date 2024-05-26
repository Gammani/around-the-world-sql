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
import { BlogDbType } from '../../../types';
import {
  BlogUpdateModel,
  CreatedBlogType,
} from '../api/models/input/blog.input.model';
import { v1 as uuidv1 } from 'uuid';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: Model<BlogDocument> & BlogModelStaticType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createBlogByAdmin(
    createdBlogDto: CreatedBlogType,
  ): Promise<CreatedBlogViewModel> {
    const newBlog = {
      id: uuidv1(),
      name: createdBlogDto.name,
      description: createdBlogDto.description,
      websiteUrl: createdBlogDto.websiteUrl,
      createdAt: new Date(),
      isMembership: true,
    };
    await this.dataSource.query(
      `INSERT INTO public.blogs(
id, name, description, "websiteUrl", "createdAt", "isMembership")
VALUES ($1, $2, $3, $4, $5, $6);`,
      [
        newBlog.id,
        newBlog.name,
        newBlog.description,
        newBlog.websiteUrl,
        newBlog.createdAt,
        newBlog.isMembership,
      ],
    );
    return {
      id: newBlog.id,
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt.toString(),
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
