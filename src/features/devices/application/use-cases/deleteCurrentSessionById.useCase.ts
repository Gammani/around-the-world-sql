import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../infrastructure/device.repository';

export class DeleteCurrentSessionByIdCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(DeleteCurrentSessionByIdCommand)
export class DeleteCurrentSessionUseCase
  implements ICommandHandler<DeleteCurrentSessionByIdCommand>
{
  constructor(private devicesRepository: DeviceRepository) {}

  async execute(command: DeleteCurrentSessionByIdCommand) {
    return await this.devicesRepository.deleteCurrentSessionById(
      command.deviceId,
    );
  }
}
