import { CommentatorInfoType, LikeStatus } from '../../../../types';

export type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: LikesInfoType;
};

export type CommentsWithPaginationViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewModel[];
};
