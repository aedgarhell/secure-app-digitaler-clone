import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ReleaseService } from '../release/release.service';

/**
 * Service handling heartbeat pings and periodic checks. On each ping
 * the last timestamp is updated for the tenant associated with the user.
 * A scheduled task examines heartbeats and triggers releases when
 * tenants miss their expected ping interval.
 */
@Injectable()
export class HeartbeatService {
  constructor(
    private prisma: PrismaService,
    private releaseService: ReleaseService,
  ) {}

  /**
   * Record a heartbeat ping for the given user. This updates (or creates)
   * the heartbeat record for the tenant associated with the user.
   *
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

  /**
   * Periodic check to identify tenants with stale heartbeats and
   * trigger a release via ReleaseService. Runs every hour.
   */
  @Cron('0 * * * *')
  async checkHeartbeats() {
    // threshold: one hour ago
    const threshold = new Date(Date.now() - 60 * 60 * 1000);
    // find heartbeats older than the threshold
    const stale = await this.prisma.heartbeat.findMany({
      where: {
        lastPing: {
          lt: threshold,
        },
      },
    });
    for (const hb of stale) {
      // attempt to trigger a release for the tenant
      await this.releaseService.triggerRelease(hb.tenantId);
    }
  }
}
