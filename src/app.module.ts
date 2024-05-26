import { configModule } from './settings/configuration/configModule';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailManager } from './features/adapter/email.manager';
import { PasswordAdapter } from './features/adapter/password.adapter';
import { JwtMiddleware } from './infrastructure/middleware/jwt.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/public/auth/auth.module';
import { RemoveAllModule } from './features/public/testing.removeAll/removeAll.module';
import { UsersModule } from './features/super-admin/users/users.module';
import { PostModule } from './features/public/posts/post.module';
import { CommentModule } from './features/public/comments/comment.module';
import { ExpiredTokenModule } from './features/public/expiredToken/expired.token.module';
import { SecurityDeviceModule } from './features/public/devices/sequrity.device.module';
import {
  User,
  UserSchema,
} from './features/super-admin/users/domain/user.entity';
import {
  Device,
  DeviceSchema,
} from './features/public/devices/domain/devices.entity';
import { UsersRepository } from './features/super-admin/users/infrastructure/users.repository';
import { SecurityDevicesService } from './features/public/devices/application/security.devices.service';
import { DeviceRepository } from './features/public/devices/infrastructure/device.repository';
import { JwtService } from './features/public/auth/application/jwt.service';
import { ExpiredTokenRepository } from './features/public/expiredToken/infrastructure/expired.token.repository';
import { BlogModule } from './features/public/blogs/blog.module';
import { BasicStrategy } from 'passport-http';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://0.0.0.0:27017', {
      dbName: 'around-the-world',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nodejs',
      password: 'nodejs',
      database: 'around-the-world',
      autoLoadEntities: false,
      synchronize: false,
    }),
    CqrsModule,
    configModule,
    AuthModule,
    RemoveAllModule,
    UsersModule,
    BlogModule,
    PostModule,
    CommentModule,
    ExpiredTokenModule,
    SecurityDeviceModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersRepository,
    EmailManager,
    PasswordAdapter,
    JwtService,
    SecurityDevicesService,
    DeviceRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
