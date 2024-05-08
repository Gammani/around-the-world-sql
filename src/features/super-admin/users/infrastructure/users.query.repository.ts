import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';
import {
  UserViewModel,
  UserWithPaginationViewModel,
} from '../api/models/output/user.output.model';
import { ObjectId } from 'mongodb';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserDbType } from '../../../types';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  // async findAllUsers(
  //   searchLoginTermQuery: string | undefined,
  //   searchEmailTermQuery: string | undefined,
  //   pageNumberQuery: string | undefined,
  //   pageSizeQuery: string | undefined,
  //   sortByQuery: string | undefined,
  //   sortDirectionQuery: string | undefined,
  // ): Promise<UserWithPaginationViewModel> {
  //   const searchLoginTerm = searchLoginTermQuery ? searchLoginTermQuery : '';
  //   const searchEmailTerm = searchEmailTermQuery ? searchEmailTermQuery : '';
  //   const pageNumber = isNaN(Number(pageNumberQuery))
  //     ? 1
  //     : Number(pageNumberQuery);
  //   const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
  //   const sortBy = sortByQuery
  //     ? `accountData.${sortByQuery}`
  //     : 'accountData.createdAt';
  //   const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1;
  //
  //   let totalCount;
  //   let users;
  //
  //   if (searchLoginTerm || searchEmailTerm) {
  //     totalCount = await this.UserModel.countDocuments({
  //       $or: [
  //         { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
  //         { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
  //       ],
  //     });
  //     //   $and: [
  //     //     {
  //     //       $or: [
  //     //         {
  //     //           'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
  //     //         },
  //     //         {
  //     //           'accountData.email': { $regex: searchEmailTerm, $options: 'i' },
  //     //         },
  //     //       ],
  //     //     },
  //     //   ],
  //     // });
  //     users = await this.UserModel.find({
  //       $or: [
  //         { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
  //         { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
  //       ],
  //     })
  //       //   $and: [
  //       //     {
  //       //       $or: [
  //       //         {
  //       //           'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
  //       //         },
  //       //         {
  //       //           'accountData.email': { $regex: searchEmailTerm, $options: 'i' },
  //       //         },
  //       //       ],
  //       //     },
  //       //   ],
  //       // })
  //       .sort({ [sortBy]: sortDirection })
  //       .skip((pageNumber - 1) * pageSize)
  //       .limit(pageSize);
  //   } else {
  //     totalCount = await this.UserModel.countDocuments({});
  //
  //     users = await this.UserModel.find({})
  //       .sort({ [sortBy]: sortDirection })
  //       .skip((pageNumber - 1) * pageSize)
  //       .limit(pageSize);
  //   }
  //
  //   const pagesCount = Math.ceil(totalCount / pageSize);
  //
  //   // const userViewModels: UserOutputModel[] = users.map((user) => ({
  //   //   id: user._id.toString(),
  //   //   login: user.accountData.login,
  //   //   email: user.accountData.email,
  //   //   createdAt: user.accountData.createdAt,
  //   // }));
  //
  //   return {
  //     pagesCount,
  //     page: pageNumber,
  //     pageSize,
  //     totalCount,
  //     items: users.map((user) => ({
  //       id: user._id.toString(),
  //       login: user.accountData.login,
  //       email: user.accountData.email,
  //       createdAt: user.accountData.createdAt,
  //     })),
  //   };
  // }

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
    const sortBy = sortByQuery
      ? `accountData.${sortByQuery}`
      : 'accountData.createdAt';

    const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1;

    const result = await this.dataSource
      .query(`SELECT id, login, email, "createdAt", "passwordHash", "recoveryCode"
\tFROM public."UserAccountData";`);
    console.log(result);
    return result;
  }

  async findUserById(userId: ObjectId): Promise<UserViewModel | null> {
    const foundUser: UserDbType | null = await this.UserModel.findOne({
      _id: userId,
    });
    if (foundUser) {
      return {
        email: foundUser.accountData.email,
        login: foundUser.accountData.login,
        userId: foundUser._id.toString(),
      };
    } else {
      return null;
    }
  }
}
