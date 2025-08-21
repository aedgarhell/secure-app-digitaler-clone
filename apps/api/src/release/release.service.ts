import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for creating and querying release records.
 * A release represents the start of a data handover process.
 */
@Injectable()
export class ReleaseService {
  constructor(private prisma: PrismaService) {}

  /**
   * Trigger a new release for the given tenant. If a pending release already
   * exists, it returns the existing record.
   * @param tenantId ID of the tenant
   */
  async triggerRelease(tenantId: number) {
    // Check for existing pending release
    const existing = await this.prisma.release.findFirst({
      where: { tenantId, status: 'pending' },
    });
    if (existing) {
      return existing;
    }
    // create new release
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
   * @param tenantId ID of the tenant
   */
  async getLatestRelease(tenantId: number) {
    return this.prisma.release.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
