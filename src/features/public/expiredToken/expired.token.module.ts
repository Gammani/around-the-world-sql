import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from './domain/expired-token.entity';
import { ExpiredTokenRepository } from './infrastructure/expired.token.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { AddExpiredRefreshTokenUseCase } from '../auth/application/use-cases/addExpiredRefreshTokenUseCase';

const useCases = [AddExpiredRefreshTokenUseCase];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
    CqrsModule,
  ],
  providers: [
    ExpiredTokenRepository,
    PasswordAdapter,
    SecurityDevicesService,
    DeviceRepository,
    ...useCases,
  ],
})
export class ExpiredTokenModule {}
