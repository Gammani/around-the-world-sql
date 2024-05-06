import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './domain/devices.entity';
import { User, UserSchema } from '../users/domain/user.entity';
import { SecurityDeviceController } from './api/security.device.controller';
import { SecurityDevicesService } from './application/security.devices.service';
import { DeviceRepository } from './infrastructure/device.repository';
import { DeviceQueryRepository } from './infrastructure/device.query.repository';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';
import { PasswordAdapter } from '../adapter/password.adapter';
import { JwtService } from '../auth/application/jwt.service';
import { UsersService } from '../users/application/users.service';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { EmailManager } from '../adapter/email.manager';
import { AddDeviceUseCase } from './application/use-cases/addDevice.useCase';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteCurrentSessionUseCase } from './application/use-cases/deleteCurrentSessionById.useCase';
import { FoundDeviceFromUserUseCase } from './application/use-cases/foundDeviceFromUserUseCase';
import { GetUserByDeviceIdUseCase } from '../users/application/use-cases/getUserByDeviceId.useCase';
import { GetDeviceByDeviceIdUseCase } from './application/use-cases/getDeviceByDeviceId.useCase';
import { AddExpiredRefreshTokenUseCase } from '../expiredToken/application/use-cases/addExpiredRefreshToken.useCase';
import { DeleteAllSessionExcludeCurrentUseCase } from './application/use-cases/deleteAllSessionExcludeCurrent.useCase';

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
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: User.name, schema: UserSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    ]),
    CqrsModule,
  ],
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
