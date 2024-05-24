import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserDbViewModelType } from '../../../../types';
import { DeviceRepository } from '../../../../public/devices/infrastructure/device.repository';

export class GetUserByDeviceIdCommand {
  constructor(public deviceId: ObjectId | string) {}
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
      return await this.usersRepository.findUserById(userId.toString());
    } else {
      return null;
    }
  }
}
