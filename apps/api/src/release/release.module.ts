import { Module, forwardRef } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { ReleaseController } from './release.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HeartbeatModule } from '../heartbeat/heartbeat.module';
import { SecretsModule } from '../secrets/secrets.module';
import { RunbooksModule } from '../runbooks/runbooks.module';

/**
 * ReleaseModule wires up services and controllers used to
 * manage data handover events triggered by missed heartbeats and
 * user-initiated releases.
 */
@Module({
  imports: [forwardRef(() => HeartbeatModule), SecretsModule, RunbooksModule],
  controllers: [ReleaseController],
  providers: [ReleaseService, PrismaService],
  exports: [ReleaseService],
})
export class ReleaseModule {}
