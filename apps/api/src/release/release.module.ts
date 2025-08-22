import { Module, forwardRef } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { ReleaseController } from './release.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HeartbeatModule } from '../heartbeat/heartbeat.module';

/**
 * ReleaseModule wires up services and controllers used to
 * manage data handover events triggered by missed heartbeats.
 */
@Module({
  imports: [forwardRef(() => HeartbeatModule)],
  controllers: [ReleaseController],
  providers: [ReleaseService, PrismaService],
  exports: [ReleaseService],
})
export class ReleaseModule {}