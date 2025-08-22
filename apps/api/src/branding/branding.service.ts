import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for managing white‑label branding settings on a per‑tenant basis.
 */
@Injectable()
export class BrandingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Update the branding JSON for a tenant.
   * @param tenantId ID of the tenant
   * @param branding Arbitrary JSON object containing branding properties
   */
  async updateBranding(tenantId: number, branding: any) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { branding },
    });
  }

  /**
   * Retrieve the branding settings for a tenant.
   * @param tenantId ID of the tenant
   */
  async getBranding(tenantId: number) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { branding: true },
    });
  }
}
