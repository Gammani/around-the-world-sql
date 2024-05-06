export type UserOutputModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type CreatedUserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type UserWithPaginationViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserOutputModel[];
};
export type UserViewModel = {
  email: string;
  login: string;
  userId: string;
};
