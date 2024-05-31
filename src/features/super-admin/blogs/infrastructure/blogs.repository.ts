import { Injectable } from '@nestjs/common';
import {
  Blog,
  BlogDocument,
  BlogModelStaticType,
} from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatedBlogViewModel } from '../api/models/output/blog.output.model';
import { BlogViewDbType } from '../../../types';
import {
  BlogUpdateModel,
  CreatedBlogType,
} from '../api/models/input/blog.input.model';
import { v1 as uuidv1, validate as validateUUID } from 'uuid';
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
      isMembership: false,
    };
    await this.dataSource.query(
      `INSERT INTO public."Blogs"(
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
      createdAt: newBlog.createdAt.toISOString(),
      isMembership: newBlog.isMembership,
    };
  }

  async findBlogById(blogId: string): Promise<BlogViewDbType | null> {
    if (validateUUID(blogId)) {
      const foundBlog = await this.dataSource.query(
        `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
FROM public."Blogs"
WHERE id = $1`,
        [blogId],
      );
      if (foundBlog.length > 0) {
        return foundBlog[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async updateBlogByAdmin(
    blogId: string,
    inputBlogModel: BlogUpdateModel,
  ): Promise<boolean> {
    try {
      await this.dataSource.query(
        `UPDATE public."Blogs"
SET name=$1, description=$2, "websiteUrl"=$3
WHERE id = $4`,
        [
          inputBlogModel.name,
          inputBlogModel.description,
          inputBlogModel.websiteUrl,
          blogId,
        ],
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    try {
      await this.dataSource.query(
        `DELETE FROM public."Blogs"
WHERE id = $1`,
        [blogId],
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."Blogs"`);
  }
  // for tests
  async findBlogByName(blogName: string) {
    return this.BlogModel.findOne({ name: blogName });
  }
}
