import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for creating, completing and querying release records.
 * A release represents the start or completion of a data handover process.
 */
@Injectable()
export class ReleaseService {
  constructor(private prisma: PrismaService) {}

  /**
   * Trigger a new release for the given tenant. If a pending release
   * already exists, it returns the existing record instead of creating
   * a new one.
   *
   * @param tenantId ID of the tenant
   */
  async triggerRelease(tenantId: number) {
    // look for an existing pending release
    const existing = await this.prisma.release.findFirst({
      where: { tenantId, status: 'pending' },
    });
    if (existing) {
      return existing;
    }
    // create a new release record
    return this.prisma.release.create({
      data: {
        tenantId,
        status: 'pending',
        createdAt: new Date(),
      },
    });
  }

  /**
   * Fetch the most recent release for a tenant.
   *
   * @param tenantId ID of the tenant
   */
  async getLatestRelease(tenantId: number) {
    return this.prisma.release.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Mark a release as completed. This updates the status and stamps
   * the completion time.  If the release does not exist, an error
   * will be thrown by Prisma.
   *
   * @param id ID of the release to complete
   */
  async completeRelease(id: number) {
    return this.prisma.release.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }
}
