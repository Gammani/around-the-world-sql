import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../infrastructure/device.repository';
import { ObjectId } from 'mongodb';

export class FoundDeviceFromUserCommand {
  constructor(
    public deviceIdFromUri: string,
    public userIdFromToken: ObjectId,
  ) {}
}

@CommandHandler(FoundDeviceFromUserCommand)
export class FoundDeviceFromUserUseCase
  implements ICommandHandler<FoundDeviceFromUserCommand>
{
  constructor(private deviceRepository: DeviceRepository) {}

  async execute(command: FoundDeviceFromUserCommand): Promise<boolean> {
    // return this.deviceRepository.findDeviceFromUserId(
    //   command.deviceIdFromUri,
    //   command.userIdFromToken,
    // );
    return true;
  }
}
