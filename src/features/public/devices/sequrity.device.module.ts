import { Module } from '@nestjs/common';
import { SecurityDeviceController } from './api/security.device.controller';
import { SecurityDevicesService } from './application/security.devices.service';
import { DeviceRepository } from './infrastructure/device.repository';
import { DeviceQueryRepository } from './infrastructure/device.query.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import { JwtService } from '../auth/application/jwt.service';
import { AddDeviceUseCase } from './application/use-cases/addDevice.useCase';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteCurrentSessionUseCase } from './application/use-cases/deleteCurrentSessionById.useCase';
import { FoundDeviceFromUserUseCase } from './application/use-cases/foundDeviceFromUserUseCase';
import { GetDeviceByDeviceIdUseCase } from './application/use-cases/getDeviceByDeviceId.useCase';
import { DeleteAllSessionExcludeCurrentUseCase } from './application/use-cases/deleteAllSessionExcludeCurrent.useCase';
import { GetUserByDeviceIdUseCase } from '../../super-admin/users/application/use-cases/getUserByDeviceId.useCase';
import { UsersService } from '../../super-admin/users/application/users.service';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../super-admin/users/infrastructure/users.query.repository';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { EmailManager } from '../../adapter/email.manager';
import { AddExpiredRefreshTokenUseCase } from '../auth/application/use-cases/addExpiredRefreshTokenUseCase';

const useCases = [
  DeleteCurrentSessionUseCase,
  AddDeviceUseCase,
  FoundDeviceFromUserUseCase,
  GetUserByDeviceIdUseCase,
  GetDeviceByDeviceIdUseCase,
  AddExpiredRefreshTokenUseCase,
  DeleteAllSessionExcludeCurrentUseCase,
];

@Module({
  imports: [CqrsModule],
  controllers: [SecurityDeviceController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SecurityDevicesService,
    DeviceRepository,
    DeviceQueryRepository,
    ExpiredTokenRepository,
    PasswordAdapter,
    JwtService,
    EmailManager,
    ...useCases,
  ],
})
export class SecurityDeviceModule {}
