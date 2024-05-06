import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { PasswordAdapter } from '../adapter/password.adapter';
import { EmailManager } from '../adapter/email.manager';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { GetUserViewModelByDeviceIdUseCase } from './application/use-cases/getUserViewModelByDeviceId.useCase';
import { CreateUserUserCase } from './application/use-cases/createUser.useCase';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserByDeviceIdUseCase } from './application/use-cases/getUserByDeviceId.useCase';
import { GetAllQueryUsersUseCase } from './application/use-cases/getAllQueryUsers.useCase';
import { GetUserByIdUseCase } from './application/use-cases/getUserById.useCase';
import { CreateUserByAdminUseCase } from './application/use-cases/createUserByAdmin.useCase';
import { DeleteUserByAdminUseCase } from './application/use-cases/deleteUserByAdmin.useCase';

const useCases = [
  CreateUserUserCase,
  GetUserViewModelByDeviceIdUseCase,
  GetUserByDeviceIdUseCase,
  GetAllQueryUsersUseCase,
  GetUserByIdUseCase,
  CreateUserByAdminUseCase,
  DeleteUserByAdminUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Device.name, schema: DeviceSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    ]),
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    PasswordAdapter,
    EmailManager,
    SecurityDevicesService,
    DeviceRepository,
    ExpiredTokenRepository,
    BasicAuthGuard,
    ...useCases,
  ],
})
export class UsersModule {}
