import { ObjectId } from 'mongodb';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';

export class BlogCreateModel {
  @Trim()
  @IsString()
  @Length(1, 15)
  @IsNotEmpty()
  name: string;

  @Trim()
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  description: string;

  @Trim()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  @IsNotEmpty()
  websiteUrl: string;
}

export class BlogUpdateModel {
  @Trim()
  @IsString()
  @Length(1, 15)
  @IsNotEmpty()
  name: string;

  @Trim()
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  description: string;

  @Trim()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  @IsNotEmpty()
  websiteUrl: string;
}

export type BlogInputDtoType = {
  blogId: ObjectId;
  blogName: string;
};
