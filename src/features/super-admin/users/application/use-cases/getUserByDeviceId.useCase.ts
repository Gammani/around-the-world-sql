import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersRepository } from '../../infrastructure/users.repository';
import { SecurityDevicesService } from '../../../../public/devices/application/security.devices.service';
import { UserDbType } from '../../../../types';

export class GetUserByDeviceIdCommand {
  constructor(public deviceId: ObjectId) {}
}

@CommandHandler(GetUserByDeviceIdCommand)
export class GetUserByDeviceIdUseCase
  implements ICommandHandler<GetUserByDeviceIdCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private securityDevicesService: SecurityDevicesService,
  ) {}

  async execute(command: GetUserByDeviceIdCommand): Promise<UserDbType | null> {
    const userId = await this.securityDevicesService.findUserIdByDeviceId(
      command.deviceId,
    );
    if (userId) {
      return await this.usersRepository.findUserById(userId.toString());
    } else {
      return null;
    }
  }
}
