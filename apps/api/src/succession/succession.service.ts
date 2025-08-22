import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for managing succession (firmennachfolge) data.
 * This stores information about a designated successor, their readiness,
 * and a questionnaire JSON blob.
 */
@Injectable()
export class SuccessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Set or update succession details for a tenant.
   * @param tenantId ID of the tenant
   * @param successorEmail Email address of the successor
   * @param questionnaire Arbitrary JSON representing the questionnaire answers
   * @param readinessScore Numeric indicator of succession readiness
   */
  async setSuccession(
    tenantId: number,
    successorEmail: string,
    questionnaire: any,
    readinessScore: number,
  ) {
    return this.prisma.succession.upsert({
      where: { tenantId },
      update: { successorEmail, questionnaire, readinessScore },
      create: { tenantId, successorEmail, questionnaire, readinessScore },
    });
  }

  /**
   * Retrieve succession details for a tenant.
   * @param tenantId ID of the tenant
   */
  async getSuccession(tenantId: number) {
    return this.prisma.succession.findUnique({
      where: { tenantId },
    });
  }
}
