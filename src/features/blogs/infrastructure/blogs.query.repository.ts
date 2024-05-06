import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  BlogViewModel,
  BlogWithPaginationViewModel,
} from '../api/models/output/blog.output.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async findAllBlogs(
    searchNameTermQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
  ): Promise<BlogWithPaginationViewModel> {
    const searchNameTerm = searchNameTermQuery ? searchNameTermQuery : '';
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const sortBy = sortByQuery ? sortByQuery : 'createdAt';
    const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1;

    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const skipPages: number = (pageNumber - 1) * pageSize;

    const items = await this.BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skipPages)
      .limit(pageSize);
    const totalCount = await this.BlogModel.countDocuments(filter);
    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: items.map((i) => ({
        id: i._id.toString(),
        name: i.name,
        description: i.description,
        websiteUrl: i.websiteUrl,
        createdAt: i.createdAt,
        isMembership: i.isMembership,
      })),
    };
  }

  async findBlogById(blogId: string): Promise<BlogViewModel | null> {
    if (!ObjectId.isValid(blogId)) {
      throw new NotFoundException();
    }
    const foundBlog = await this.BlogModel.findById(blogId);
    if (foundBlog) {
      return {
        id: foundBlog._id.toString(),
        name: foundBlog.name,
        description: foundBlog.description,
        websiteUrl: foundBlog.websiteUrl,
        createdAt: foundBlog.createdAt,
        isMembership: foundBlog.isMembership,
      };
    } else {
      throw new NotFoundException();
    }
  }
}
