import { Module, forwardRef } from '@nestjs/common';
import { HeartbeatService } from './heartbeat.service';
import { HeartbeatController } from './heartbeat.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ReleaseModule } from '../release/release.module';

/**
 * HeartbeatModule wires up controllers and providers for handling
 * proof-of-life pings and eventual release triggers.
 */
@Module({
  imports: [forwardRef(() => ReleaseModule)],
  controllers: [HeartbeatController],
  providers: [HeartbeatService, PrismaService],
  exports: [HeartbeatService],
})
export class HeartbeatModule {}