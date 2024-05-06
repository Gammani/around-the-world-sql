import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { DeviceRepository } from '../../infrastructure/device.repository';

export class DeleteAllSessionExcludeCurrentCommand {
  constructor(public deviceId: ObjectId) {}
}

@CommandHandler(DeleteAllSessionExcludeCurrentCommand)
export class DeleteAllSessionExcludeCurrentUseCase
  implements ICommandHandler<DeleteAllSessionExcludeCurrentCommand>
{
  constructor(private devicesRepository: DeviceRepository) {}

  async execute(command: DeleteAllSessionExcludeCurrentCommand) {
    return await this.devicesRepository.deleteAllSessionExcludeCurrent(
      command.deviceId,
    );
  }
}
