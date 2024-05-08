import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { BlogCreateModel } from '../api/models/input/blog.input.model';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  websiteUrl: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.statics.createBlog = (
  dto: BlogCreateModel,
  BlogModel: Model<BlogDocument> & BlogModelStaticType,
) => {
  const blog = new BlogModel();
  blog._id = new ObjectId();
  blog.name = dto.name;
  blog.description = dto.description;
  blog.websiteUrl = dto.websiteUrl;
  blog.createdAt = new Date().toISOString();
  blog.isMembership = false;
  console.log(blog);
  return blog;
};

export type BlogModelStaticType = {
  createBlog: (
    dto: BlogCreateModel,
    BlogModel: Model<BlogDocument> & BlogModelStaticType,
  ) => {
    _id: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
  };
};
