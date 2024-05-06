import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './domain/comments.entity';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { CommentsRepository } from './infrastructure/comments.repository';
import { JwtService } from '../auth/application/jwt.service';
import { PasswordAdapter } from '../adapter/password.adapter';
import { UsersService } from '../users/application/users.service';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { EmailManager } from '../adapter/email.manager';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { User, UserSchema } from '../users/domain/user.entity';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';
import { CommentsQueryRepository } from './infrastructure/comments.query.repository';
import {
  CommentLike,
  CommentLikeSchema,
} from '../commentLike/domain/commentLike.entity';
import { CommentLikeService } from '../commentLike/appliacation/commentLike.service';
import { CommentLikeRepository } from '../commentLike/infrastructure/commentLike.repository';
import { GetQueryCommentsByPostIdUseCase } from './application/use-cases/getQueryCommentsByPostId.useCase';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentUseCase } from './application/use-cases/CreateComment.useCase';
import { GetCommentByIdUseCase } from './application/use-cases/getCommentById.useCase';
import { GetQueryCommentByIdUseCase } from './application/use-cases/getQueryCommentById.useCase';
import { UpdateCommentUseCase } from './application/use-cases/updateComment.useCase';
import { DeleteCommentByIdUseCase } from './application/use-cases/deleteCommentById.useCase';
import { GetCommentLikeUseCase } from '../commentLike/appliacation/use-cases/getCommentLike.useCase';
import { UpdateCommentLikeUseCase } from '../commentLike/appliacation/use-cases/updateCommentLike.useCase';
import { CreateCommentLikeUseCase } from '../commentLike/appliacation/use-cases/createCommentLike.useCase';

const useCases = [
  GetQueryCommentsByPostIdUseCase,
  CreateCommentUseCase,
  GetCommentByIdUseCase,
  GetQueryCommentByIdUseCase,
  UpdateCommentUseCase,
  DeleteCommentByIdUseCase,
  GetCommentLikeUseCase,
  UpdateCommentLikeUseCase,
  CreateCommentLikeUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
    CqrsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentLikeService,
    CommentLikeRepository,
    CommentsQueryRepository,
    JwtService,
    PasswordAdapter,
    EmailManager,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SecurityDevicesService,
    DeviceRepository,
    ExpiredTokenRepository,
    ...useCases,
  ],
})
export class CommentModule {}
