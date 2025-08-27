import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

/**
 * Service providing audit log functionality with signature creation and verification.
 * Each call persists an entry to the AuditLog table and signs it.
 */
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate HMAC signature for an audit entry.
   *
   * @param actorId ID of the user performing the action
   * @param action  Description of the action
   * @param target  String describing the entity affected
   * @param ts      Timestamp of the action
   */
  private createSignature(actorId: number, action: string, target: string, ts: Date): string {
    const secret = process.env.AUDIT_SECRET || 'default-secret';
    const data = `${actorId}:${action}:${target}:${ts.toISOString()}`;
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Create a new audit log entry.
   *
   * @param actorId ID of the user performing the action
   * @param action  Description of the action
   * @param target  String describing the entity affected
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

  /**
   * Retrieve all audit log entries.
   */
  async findAll() {
    return this.prisma.auditLog.findMany();
  }

  /**
   * Retrieve a single audit log entry by its ID.
   */
  async findOne(id: number) {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }

  /**
   * Verify that a provided signature matches the expected signature for
   * an audit entry defined by its components. Returns true if the
   * signature is valid, otherwise false.
   *
   * @param actorId    ID of the user performing the action
   * @param action     Description of the action
   * @param target     Target string
   * @param ts         Timestamp used for signing (as a Date instance)
   * @param signature  Signature provided to verify
   */
  verifySignature(
    actorId: number,
    action: string,
    target: string,
    ts: Date,
    signature: string,
  ): boolean {
    const expected = this.createSignature(actorId, action, target, ts);
    return expected === signature;
  }

  /**
   * Retrieve all audit log entries performed by a specific actor.
   *
   * @param actorId ID of the user who performed the actions
   */
  async findByActor(actorId: number) {
    // actor is stored as a string in the audit log; convert the id to string for comparison
    return this.prisma.auditLog.findMany({ where: { actor: actorId.toString() } });
  }

  /**
   * Retrieve all audit log entries matching a specific action.
   *
   * @param action Action name to filter by
   */
  async findByAction(action: string) {
    return this.prisma.auditLog.findMany({ where: { action } });
  }
}