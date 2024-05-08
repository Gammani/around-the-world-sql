import { SecurityDevicesService } from '../application/security.devices.service';
import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeviceQueryRepository } from '../infrastructure/device.query.repository';
import { Request } from 'express';
import { RequestWithDeviceId } from '../../auth/api/models/input/auth.input.model';
import { DeleteCurrentSessionByIdCommand } from '../application/use-cases/deleteCurrentSessionById.useCase';
import { CommandBus } from '@nestjs/cqrs';
import { CheckRefreshToken } from '../../auth/guards/jwt-refreshToken.guard';
import { ObjectId } from 'mongodb';
import { GetDeviceByDeviceIdCommand } from '../application/use-cases/getDeviceByDeviceId.useCase';
import { DeleteAllSessionExcludeCurrentCommand } from '../application/use-cases/deleteAllSessionExcludeCurrent.useCase';
import { UsersService } from '../../../super-admin/users/application/users.service';
import { UserDbType } from '../../../types';
import { GetUserByDeviceIdCommand } from '../../../super-admin/users/application/use-cases/getUserByDeviceId.useCase';

@UseGuards(CheckRefreshToken)
@Controller('security/devices')
export class SecurityDeviceController {
  constructor(
    private securityDeviceService: SecurityDevicesService,
    private deviceQueryRepository: DeviceQueryRepository,
    private userService: UsersService,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllDevicesFromUser(@Req() req: Request & RequestWithDeviceId) {
    const foundUser: UserDbType | null =
      await this.userService.findUserByDeviceId(req.deviceId);
    if (foundUser)
      return await this.deviceQueryRepository.findAllActiveSessionFromUserId(
        foundUser._id,
      );
  }

  @Delete()
  @HttpCode(204)
  async terminateAllExcludeCurrentSession(
    @Req() req: Request & RequestWithDeviceId,
  ) {
    debugger;
    await this.commandBus.execute(
      new DeleteAllSessionExcludeCurrentCommand(req.deviceId),
    );
  }

  @Delete(':deviceId')
  @HttpCode(204)
  async terminateSessionById(
    @Req() req: Request & RequestWithDeviceId,
    @Param('deviceId') deviceId: string,
  ) {
    const foundDeviceByDeviceId = await this.commandBus.execute(
      new GetDeviceByDeviceIdCommand(deviceId),
    );

    if (foundDeviceByDeviceId) {
      const foundUserByDeviceIdFromToken: UserDbType | null =
        await this.commandBus.execute(
          new GetUserByDeviceIdCommand(req.deviceId),
        );
      const foundUserFromUriParam: UserDbType | null =
        await this.commandBus.execute(
          new GetUserByDeviceIdCommand(new ObjectId(deviceId)),
        );
      if (
        foundUserFromUriParam?._id.toString() ===
        foundUserByDeviceIdFromToken?._id.toString()
      ) {
        await this.commandBus.execute(
          new DeleteCurrentSessionByIdCommand(deviceId),
        );
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new NotFoundException();
    }
  }
}
