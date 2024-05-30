import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import {
  BlogViewModel,
  BlogWithPaginationViewModel,
} from '../api/models/output/blog.output.model';
import { validate as validateUUID } from 'uuid';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

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
    const offset = (pageNumber - 1) * pageSize;
    const validSortFields = [
      'id',
      'name',
      'description',
      'websiteUrl',
      'createdAt',
      'isMembership',
    ];
    const sortBy =
      sortByQuery && validSortFields.includes(sortByQuery)
        ? `"${sortByQuery}"`
        : `"createdAt"`;

    const sortDirection = sortDirectionQuery === 'asc' ? 'asc' : 'desc';

    const totalBlogs = await this.dataSource.query(
      `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
FROM public."Blogs"
WHERE LOWER(name) ILIKE '%${searchNameTerm}%'`,
      [],
    );
    const totalCount = totalBlogs.length;

    const blogs = await this.dataSource.query(
      `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
FROM public."Blogs"
WHERE LOWER(name) ILIKE '%${searchNameTerm}%' 
ORDER BY ${sortBy} ${sortDirection}
  LIMIT $1 OFFSET $2`,
      [pageSize, offset],
    );

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        websiteUrl: i.websiteUrl,
        createdAt: i.createdAt,
        isMembership: i.isMembership,
      })),
    };
  }

  async findBlogById(blogId: string): Promise<BlogViewModel | null> {
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
}
