import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UserDbType } from '../../../types';
import { SecurityDevicesService } from '../../../devices/application/security.devices.service';
import { UsersRepository } from '../../infrastructure/users.repository';

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
      return await this.usersRepository.findUserById(userId);
    } else {
      return null;
    }
  }
}
