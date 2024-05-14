import { CommandHandler } from '@nestjs/cqrs';
import { SecurityDevicesService } from '../../../../public/devices/application/security.devices.service';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';

export class GetUserViewModelByUserIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetUserViewModelByUserIdCommand)
export class GetUserViewModelByUserIdUseCase {
  constructor(
    private securityDevicesService: SecurityDevicesService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: GetUserViewModelByUserIdCommand) {
    const foundUser = await this.usersQueryRepository.findUserById(
      command.userId,
    );
    if (foundUser) {
      console.log(foundUser);
      return foundUser;
    } else {
      return null;
    }
  }
}
