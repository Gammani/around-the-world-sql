import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { DeviceRepository } from '../../../../public/devices/infrastructure/device.repository';

export class GetUserIdByDeviceIdCommand {
  constructor(public deviceId: ObjectId | string) {}
}

@CommandHandler(GetUserIdByDeviceIdCommand)
export class GetUserIdByDeviceIdUseCase
  implements ICommandHandler<GetUserIdByDeviceIdCommand>
{
  constructor(private devicesRepository: DeviceRepository) {}

  async execute(command: GetUserIdByDeviceIdCommand): Promise<string | null> {
    const userId = await this.devicesRepository.findUserIdByDeviceId(
      command.deviceId,
    );
    if (userId) {
      return userId;
    } else {
      return null;
    }
  }
}
