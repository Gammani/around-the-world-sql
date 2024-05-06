import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateModel } from '../../api/models/input/create-user.input.model';
import { CreatedUserViewModel } from '../../api/models/output/user.output.model';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelStaticType,
} from '../../domain/user.entity';
import { Model } from 'mongoose';
import { PasswordAdapter } from '../../../adapter/password.adapter';
import { UsersRepository } from '../../infrastructure/users.repository';

export class CreateUserByAdminCommand {
  constructor(public inputUserModel: UserCreateModel) {}
}

@CommandHandler(CreateUserByAdminCommand)
export class CreateUserByAdminUseCase
  implements ICommandHandler<CreateUserByAdminCommand>
{
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument> & UserModelStaticType,
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
  ) {}

  async execute(
    command: CreateUserByAdminCommand,
  ): Promise<CreatedUserViewModel> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      command.inputUserModel.password,
    );
    const createdUser = this.UserModel.createUser(
      command.inputUserModel,
      passwordHash,
      this.UserModel,
      true,
    );
    return await this.usersRepository.createUser(createdUser);
  }
}
