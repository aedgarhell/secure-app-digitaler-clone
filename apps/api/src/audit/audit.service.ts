import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

/**
 * Service providing audit log functionality.
 * Each call persists an entry to the AuditLog table and signs it.
 */
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /** Generate HMAC signature for an audit entry */
  private createSignature(actorId: number, action: string, target: string, ts: Date): string {
    const secret = process.env.AUDIT_SECRET || 'default-secret';
    const data = `${actorId}:${action}:${target}:${ts.toISOString()}`;
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Create a new audit log entry.
   * @param actorId ID of the user performing the action
   * @param action Description of the action
   * @param target String describing the entity affected
   */
  async log(actorId: number, action: string, target: string) {
    const ts = new Date();
    const signature = this.createSignature(actorId, action, target, ts);
    return this.prisma.auditLog.create({
      data: {
        actor: actorId.toString(),
        action,
        target,
        ts,
        signature,
      },
    });
  }

  /** Retrieve all audit log entries */
  async findAll() {
    return this.prisma.auditLog.findMany();
  }

  /** Retrieve a single audit log entry by its ID */
  async findOne(id: number) {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }
}
