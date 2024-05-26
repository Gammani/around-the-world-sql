import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BasicStrategy } from '../../features/public/auth/strategies/basic.strategy';
import { BasicAuthGuard } from '../../features/public/auth/guards/basic-auth.guard';

@Module({
  imports: [CqrsModule],
  providers: [BasicStrategy, BasicAuthGuard],
  controllers: [],
  exports: [CqrsModule, BasicStrategy],
})
export class SharingModule {}
