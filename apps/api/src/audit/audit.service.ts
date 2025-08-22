import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service providing basic audit log functionality.
 * Each call persists an entry to the AuditLog table.
 */
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new audit log entry.
   * @param actorId ID of the user performing the action
   * @param action Description of the action
   * @param target String describing the entity affected
   */
  async log(actorId: number, action: string, target: string) {
    return this.prisma.auditLog.create({
      data: {
        actor: actorId.toString(),
        action,
        target,
        ts: new Date(),
        signature: '',
      },
    });
  }
}
