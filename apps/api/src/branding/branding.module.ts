import { Module } from '@nestjs/common';
import { BrandingService } from './branding.service';
import { BrandingController } from './branding.controller';
import { PrismaService } from '../prisma/prisma.service';

/**
 * BrandingModule wires up services and controllers used to manage
 * tenant-specific white‑label appearance settings.
 */
@Module({
  controllers: [BrandingController],
  providers: [BrandingService, PrismaService],
  exports: [BrandingService],
})
export class BrandingModule {}
