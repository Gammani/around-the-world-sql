import { configModule } from './settings/configuration/configModule';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './features/users/users.module';
import { RemoveAllModule } from './features/testing.removeAll/removeAll.module';
import { BlogModule } from './features/blogs/blog.module';
import { PostModule } from './features/posts/post.module';
import { AuthModule } from './features/auth/auth.module';
import { ExpiredTokenModule } from './features/expiredToken/expired.token.module';
import { CommentModule } from './features/comments/comment.module';
import { SecurityDeviceModule } from './features/devices/sequrity.device.module';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { EmailManager } from './features/adapter/email.manager';
import { PasswordAdapter } from './features/adapter/password.adapter';
import { JwtMiddleware } from './infrastructure/middleware/jwt.middleware';
import { JwtService } from './features/auth/application/jwt.service';
import { SecurityDevicesService } from './features/devices/application/security.devices.service';
import { Device, DeviceSchema } from './features/devices/domain/devices.entity';
import { DeviceRepository } from './features/devices/infrastructure/device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

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
