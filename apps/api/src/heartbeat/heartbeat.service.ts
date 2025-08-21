import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReleaseService } from '../release/release.service';

/**
 * Service handling heartbeat pings and release checks.
 * On each ping, the lastPing timestamp is updated for the tenant
 * associated with the requesting user. A scheduled check could later
 * examine heartbeats against policies and trigger releases via ReleaseService.
 */
@Injectable()
export class HeartbeatService {
  constructor(
    private prisma: PrismaService,
    private releaseService: ReleaseService,
  ) {}

  /**
   * Record a heartbeat ping for the given user. This updates (or creates)
   * the Heartbeat record for the tenant associated with the user.
   * @param userId ID of the user sending the heartbeat
   */
  async ping(userId: number) {
    // fetch user and tenant
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const tenantId = user.tenantId;
    // upsert heartbeat entry
    await this.prisma.heartbeat.upsert({
      where: { tenantId },
      update: { lastPing: new Date() },
      create: { tenantId, lastPing: new Date() },
    });
    return { message: 'pong' };
  }
}
