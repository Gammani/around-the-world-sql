import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserWithPaginationViewModel } from './models/output/user.output.model';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import { UsersService } from '../application/users.service';
import { UserCreateModel } from './models/input/create-user.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllQueryUsersCommand } from '../application/use-cases/getAllQueryUsers.useCase';
import { CreateUserByAdminCommand } from '../application/use-cases/createUserByAdmin.useCase';
import { DeleteUserByAdminCommand } from '../application/use-cases/deleteUserByAdmin.useCase';
import { BasicAuthGuard } from '../../../public/auth/guards/basic-auth.guard';
import { GetUserViewModelByUserIdCommand } from '../application/use-cases/getUserViewModelByUserId.useCase';

@Controller('sa/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}
  @Get()
  async getAllUsers(
    @Query()
    query: {
      searchLoginTerm: string | undefined;
      searchEmailTerm: string | undefined;
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundUsers: UserWithPaginationViewModel =
      await this.commandBus.execute(
        new GetAllQueryUsersCommand(
          query.searchLoginTerm,
          query.searchEmailTerm,
          query.pageNumber,
          query.pageSize,
          query.sortBy,
          query.sortDirection,
        ),
      );
    return foundUsers;
  }

  @Get(':id')
  async findUserById(@Param('id') userId: string) {
    const foundUser = await this.commandBus.execute(
      new GetUserViewModelByUserIdCommand(userId),
    );
    if (foundUser) {
      return foundUser;
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUserByAdmin(@Body() inputUserModel: UserCreateModel) {
    return this.commandBus.execute(
      new CreateUserByAdminCommand(inputUserModel),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async removeUserByAdmin(@Param('id') userId: string) {
    const userRemoved = await this.commandBus.execute(
      new DeleteUserByAdminCommand(userId),
    );
    if (!userRemoved) {
      throw new NotFoundException();
    }
  }
}
