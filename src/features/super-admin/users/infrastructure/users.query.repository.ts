import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';
import {
  UserViewModel,
  UserWithPaginationViewModel,
} from '../api/models/output/user.output.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async findAllUsers(
    searchLoginTermQuery: string | undefined,
    searchEmailTermQuery: string | undefined,
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
  ): Promise<UserWithPaginationViewModel> {
    const searchLoginTerm = searchLoginTermQuery ? searchLoginTermQuery : '';
    const searchEmailTerm = searchEmailTermQuery ? searchEmailTermQuery : '';
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const sortBy = sortByQuery ? `${sortByQuery}` : 'account."createdAt"';

    const sortDirection = sortDirectionQuery === 'asc' ? 'asc' : 'desc';

    const totalUsers = await this.dataSource.query(
      `    SELECT account."id", account.login, account.email, account."createdAt", account."passwordHash",
        account."recoveryCode", email."confirmationCode", email."expirationDate"
    FROM public."UserAccountData" as account
    LEFT JOIN "UserEmailData" as email
    ON account."id" = email."userId"
    WHERE "email" like '%${searchEmailTerm}%' and "login" like '%${searchLoginTerm}%'
    ORDER BY ${sortBy} ${sortDirection}`,
      [],
    );
    const totalCount = totalUsers.length;

    const users = await this.dataSource.query(
      `    SELECT account."id", account.login, account.email, account."createdAt", account."passwordHash",
        account."recoveryCode", email."confirmationCode", email."expirationDate"
    FROM public."UserAccountData" as account
    LEFT JOIN "UserEmailData" as email
    ON account."id" = email."userId"
    WHERE "email" like '%${searchEmailTerm}%' and "login" like '%${searchLoginTerm}%'
    ORDER BY ${sortBy} ${sortDirection}
    LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize}`,
      [],
    );

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: users.map((user) => ({
        id: user.id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      })),
    };
  }

  async findUserById(userId: string): Promise<UserViewModel | null> {
    if (validateUUID(userId)) {
      const foundUser = await this.dataSource.query(
        `SELECT account."id", account.login, account.email, account."createdAt", account."passwordHash",
        account."recoveryCode", email."confirmationCode", email."expirationDate"
    FROM public."UserAccountData" as account
    LEFT JOIN "UserEmailData" as email
    ON account."id" = email."userId"
WHERE account."id" = $1`,
        [userId],
      );
      if (foundUser.length > 0) {
        return {
          email: foundUser[0].email,
          login: foundUser[0].login,
          userId: foundUser[0].id,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
