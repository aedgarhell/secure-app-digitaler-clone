import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecretsService } from '../secrets/secrets.service';
import { RunbooksService } from '../runbooks/runbooks.service';

/**
 * Service for creating, distributing and completing release records.
 * A release represents the start or completion of a data handover process.
 */
@Injectable()
export class ReleaseService {
  constructor(
    private prisma: PrismaService,
    private secretsService: SecretsService,
    private runbooksService: RunbooksService,
  ) {}

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
   * the completion time. If the release does not exist, an error
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

  /**
   * Distribute the data for a release. This retrieves all secrets and runbooks
   * for the release's tenant, marks the release as distributed, and returns
   * the collected data.
   *
   * @param id ID of the release to distribute
   */
  async distributeRelease(id: number) {
    const release = await this.prisma.release.findUnique({
      where: { id },
    });

    if (!release) {
      throw new NotFoundException(`Release with id ${id} not found`);
    }

    const tenantId = release.tenantId;
    const secrets = await this.secretsService.findAllByTenant(tenantId);
    const runbooks = await this.runbooksService.findAllByTenant(tenantId);

    // update release record: mark as distributed and set completion timestamp
    await this.prisma.release.update({
      where: { id },
      data: {
        status: 'distributed',
        completedAt: new Date(),
      },
    });

    return {
      id: release.id,
      tenantId,
      secrets,
      runbooks,
    };
  }
}
