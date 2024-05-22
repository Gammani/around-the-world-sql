// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { ObjectId } from 'mongodb';
// import { SecurityDevicesService } from '../../../devices/application/security.devices.service';
// import { ExpiredTokenRepository } from '../../infrastructure/expired.token.repository';
//
// export class AddExpiredRefreshTokenCommand {
//   constructor(
//     public deviceId: ObjectId | string,
//     public refreshToken: string,
//   ) {}
// }
//
// @CommandHandler(AddExpiredRefreshTokenCommand)
// export class AddExpiredRefreshTokenUseCase
//   implements ICommandHandler<AddExpiredRefreshTokenCommand>
// {
//   constructor(
//     private securityDevicesService: SecurityDevicesService,
//     private expiredTokenRepository: ExpiredTokenRepository,
//   ) {}
//
//   async execute(command: AddExpiredRefreshTokenCommand) {
//     const foundUserId = await this.securityDevicesService.findUserIdByDeviceId(
//       command.deviceId,
//     );
//     if (foundUserId) {
//       return await this.expiredTokenRepository.addExpiredRefreshToken(
//         command.deviceId,
//         foundUserId,
//         command.refreshToken,
//       );
//     }
//   }
// }
