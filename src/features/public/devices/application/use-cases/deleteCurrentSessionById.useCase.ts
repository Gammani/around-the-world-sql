import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../../infrastructure/device.repository';
import { ExpiredTokenRepository } from '../../../expiredToken/infrastructure/expired.token.repository';

export class DeleteCurrentSessionByIdCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(DeleteCurrentSessionByIdCommand)
export class DeleteCurrentSessionUseCase
  implements ICommandHandler<DeleteCurrentSessionByIdCommand>
{
  constructor(
    private devicesRepository: DeviceRepository,
    private expiredTokenRepository: ExpiredTokenRepository,
  ) {}

  async execute(command: DeleteCurrentSessionByIdCommand) {
    await this.devicesRepository.deleteCurrentSessionById(command.deviceId);
    await this.expiredTokenRepository.removeExpiredTokensByDeviceId(
      command.deviceId.toString(),
    );
    return;
  }
}
