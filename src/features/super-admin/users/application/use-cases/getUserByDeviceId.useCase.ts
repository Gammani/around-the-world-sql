import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserDbViewModelType } from '../../../../types';
import { DeviceRepository } from '../../../../public/devices/infrastructure/device.repository';

export class GetUserByDeviceIdCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(GetUserByDeviceIdCommand)
export class GetUserByDeviceIdUseCase
  implements ICommandHandler<GetUserByDeviceIdCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private devicesRepository: DeviceRepository,
  ) {}

  async execute(
    command: GetUserByDeviceIdCommand,
  ): Promise<UserDbViewModelType | null> {
    const userId = await this.devicesRepository.findUserIdByDeviceId(
      command.deviceId,
    );
    if (userId) {
      return await this.usersRepository.findUserById(userId);
    } else {
      return null;
    }
  }
}
