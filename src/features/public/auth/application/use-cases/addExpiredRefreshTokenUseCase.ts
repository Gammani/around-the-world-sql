import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExpiredTokenRepository } from '../../../expiredToken/infrastructure/expired.token.repository';
import { DeviceRepository } from '../../../devices/infrastructure/device.repository';

export class AddExpiredRefreshTokenCommand {
  constructor(
    public deviceId: string,
    public refreshToken: string,
  ) {}
}

@CommandHandler(AddExpiredRefreshTokenCommand)
export class AddExpiredRefreshTokenUseCase
  implements ICommandHandler<AddExpiredRefreshTokenCommand>
{
  constructor(
    private expiredTokenRepository: ExpiredTokenRepository,
    private deviceRepository: DeviceRepository,
  ) {}

  async execute(command: AddExpiredRefreshTokenCommand) {
    const foundUserId = await this.deviceRepository.findUserIdByDeviceId(
      command.deviceId,
    );
    if (foundUserId) {
      return await this.expiredTokenRepository.addExpiredRefreshToken(
        command.deviceId,
        foundUserId,
        command.refreshToken,
      );
    } else {
      return;
    }
  }
}
