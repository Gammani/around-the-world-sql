import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { DeviceRepository } from '../../infrastructure/device.repository';
import { ExpiredTokenRepository } from '../../../expiredToken/infrastructure/expired.token.repository';

export class DeleteAllSessionExcludeCurrentCommand {
  constructor(
    public deviceId: ObjectId | string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteAllSessionExcludeCurrentCommand)
export class DeleteAllSessionExcludeCurrentUseCase
  implements ICommandHandler<DeleteAllSessionExcludeCurrentCommand>
{
  constructor(
    private devicesRepository: DeviceRepository,
    private expiredTokenRepository: ExpiredTokenRepository,
  ) {}

  async execute(command: DeleteAllSessionExcludeCurrentCommand) {
    await this.devicesRepository.deleteAllSessionExcludeCurrent(
      command.deviceId,
      command.userId,
    );
    await this.expiredTokenRepository.removeAllExpiredTokensByDeviceIdFromUserIdAllSessionExcludeCurrent(
      command.deviceId.toString(),
      command.userId,
    );
    return;
  }
}
