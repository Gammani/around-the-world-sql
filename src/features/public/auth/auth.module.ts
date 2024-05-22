import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { UsersService } from '../../super-admin/users/application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from './application/auth.service';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { JwtService } from './application/jwt.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfirmEmailUseCase } from './application/use-cases/confirmEmail.useCase';
import { UpdatePasswordUseCase } from './application/use-cases/updatePassword.useCase';
import { PasswordRecoveryUseCase } from './application/use-cases/passwordRecovery.useCase';
import { FindAndUpdateDeviceAfterRefreshUseCase } from '../devices/application/use-cases/findAndUpdateDeviceAfterRefresh.useCase';
import { User, UserSchema } from '../../super-admin/users/domain/user.entity';
import { UsersRepository } from '../../super-admin/users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../super-admin/users/infrastructure/users.query.repository';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { EmailManager } from '../../adapter/email.manager';
import { LoginIsExistConstraint } from '../../../infrastructure/decorators/validate/login.isExist.decorator';
import { EmailCodeIsConfirmConstraint } from '../../../infrastructure/decorators/validate/email-code-is-confirm-constraint.service';
import { EmailIsExistConstraint } from '../../../infrastructure/decorators/validate/email.isExist.decorator';
import { EmailIsConfirmedConstraint } from '../../../infrastructure/decorators/validate/email.isConfirmed.decorator';
import { IsValidRecoveryCodeConstraint } from '../../../infrastructure/decorators/validate/isValid.recoveryCode.decorator';
import { IsValidEmailConstraint } from '../../../infrastructure/decorators/validate/email.isValid.decorator';
import { IsValidPasswordRecoveryCodeConstraint } from '../../../infrastructure/decorators/validate/isValid.passwordRecoveryCode.decorator';

const useCases = [
  ConfirmEmailUseCase,
  UpdatePasswordUseCase,
  PasswordRecoveryUseCase,
  PasswordRecoveryUseCase,
  FindAndUpdateDeviceAfterRefreshUseCase,
];
const decorators = [
  LoginIsExistConstraint,
  EmailCodeIsConfirmConstraint,
  EmailIsExistConstraint,
  EmailIsConfirmedConstraint,
  IsValidRecoveryCodeConstraint,
  IsValidEmailConstraint,
  IsValidPasswordRecoveryCodeConstraint,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    PasswordAdapter,
    EmailManager,
    DeviceRepository,
    SecurityDevicesService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    EmailManager,
    ExpiredTokenRepository,
    ...decorators,
    ...useCases,
  ],
})
export class AuthModule {}
