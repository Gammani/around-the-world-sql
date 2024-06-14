import { configModule } from './settings/configuration/configModule';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { UsersRepository } from './features/super-admin/users/infrastructure/users.repository';
import { SecurityDevicesService } from './features/public/devices/application/security.devices.service';
import { DeviceRepository } from './features/public/devices/infrastructure/device.repository';
import { JwtService } from './features/public/auth/application/jwt.service';
import { BlogSuperAdminModule } from './features/super-admin/blogs/blogSuperAdminModule';
import { BlogPublicModule } from './features/public/blogs/blogPublicModule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sa',
      database: 'around-the-world-typeorm',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CqrsModule,
    configModule,
    AuthModule,
    RemoveAllModule,
    UsersModule,
    BlogPublicModule,
    BlogSuperAdminModule,
    PostModule,
    CommentModule,
    ExpiredTokenModule,
    SecurityDeviceModule,
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
