import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../infrastructure/device.repository';

export class GetDeviceByDeviceIdCommand {
  constructor(public deviceIdFromUri: string) {}
}

@CommandHandler(GetDeviceByDeviceIdCommand)
export class GetDeviceByDeviceIdUseCase
  implements ICommandHandler<GetDeviceByDeviceIdCommand>
{
  constructor(private deviceRepository: DeviceRepository) {}

  async execute(command: GetDeviceByDeviceIdCommand): Promise<boolean> {
    const foundDevice = await this.deviceRepository.findDeviceByDeviceId(
      command.deviceIdFromUri,
    );
    return !!foundDevice;
  }
}
