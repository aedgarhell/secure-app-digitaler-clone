import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Module providing the audit service for logging actions.
 */
@Module({
  providers: [AuditService, PrismaService],
  exports: [AuditService],
})
export class AuditModule {}
