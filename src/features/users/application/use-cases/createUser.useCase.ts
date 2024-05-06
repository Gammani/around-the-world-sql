import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordAdapter } from '../../../adapter/password.adapter';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelStaticType,
} from '../../domain/user.entity';
import { Model } from 'mongoose';
import { UsersRepository } from '../../infrastructure/users.repository';
import { EmailManager } from '../../../adapter/email.manager';
import { v4 as uuidv4 } from 'uuid';
import { UserCreateModel } from '../../api/models/input/create-user.input.model';
import { ServiceUnavailableException } from '@nestjs/common';

export class CreateUserCommand {
  constructor(public inputUserModel: UserCreateModel) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUserCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument> & UserModelStaticType,
    private usersRepository: UsersRepository,
    private passwordAdapter: PasswordAdapter,
    private emailManager: EmailManager,
  ) {}

  async execute(command: CreateUserCommand) {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      command.inputUserModel.password,
    );
    const confirmationCode = uuidv4();
    const createUser = this.UserModel.createUser(
      command.inputUserModel,
      passwordHash,
      this.UserModel,
      false,
      confirmationCode,
    );

    const createdUser = await this.usersRepository.createUser(createUser);
    try {
      await this.emailManager.sendEmail(
        command.inputUserModel.email,
        command.inputUserModel.login,
        `\` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>
 </p>\``,
      );
    } catch (error) {
      console.log(error);
      await this.usersRepository.deleteUser(createdUser.id);
      throw new ServiceUnavailableException();
    }
    return createdUser;
  }
}
