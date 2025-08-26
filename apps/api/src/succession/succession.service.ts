import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

/**
 * Service for managing succession (firmennachfolge) data. This service now
 * supports inviting a successor and accepting the invitation, in addition
 * to setting and retrieving basic succession details.
 */
@Injectable()
export class SuccessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Set or update succession details for a tenant.
   *
   * @param tenantId        ID of the tenant
   * @param successorEmail  Email address of the successor
   * @param questionnaire   Arbitrary JSON representing the questionnaire answers
   * @param readinessScore  Numeric indicator of succession readiness
   */
  async setSuccession(
    tenantId: number,
    successorEmail: string,
    questionnaire: any,
    readinessScore: number,
  ) {
    return this.prisma.succession.upsert({
      where: { tenantId },
      update: {
        successorEmail,
        questionnaire,
        readinessScore,
      },
      create: {
        tenantId,
        successorEmail,
        questionnaire,
        readinessScore,
      },
    });
  }

  /**
   * Retrieve succession details for a tenant.
   *
   * @param tenantId ID of the tenant
   */
  async getSuccession(tenantId: number) {
    return this.prisma.succession.findUnique({
      where: { tenantId },
    });
  }

  /**
   * Invite a successor by generating a unique token and storing it in the
   * succession record. In a real implementation this would trigger an email
   * to the successor containing the token.
   *
   * @param tenantId ID of the tenant
   * @param successorEmail Email address of the successor
   */
  async inviteSuccessor(tenantId: number, successorEmail: string) {
    const token = randomBytes(16).toString('hex');
    const questionnaire = { inviteToken: token };

    await this.prisma.succession.upsert({
      where: { tenantId },
      update: {
        successorEmail,
        questionnaire,
        readinessScore: 0,
      },
      create: {
        tenantId,
        successorEmail,
        questionnaire,
        readinessScore: 0,
      },
    });

    return { token };
  }

  /**
   * Accept a succession invitation by token. This will mark the succession
   * record as accepted (readinessScore set to 1). If no record matches
   * the token, a BadRequestException is thrown.
   *
   * @param token Invitation token provided by the successor
   */
  async acceptSuccessor(token: string) {
    // fetch all succession records and find one matching the token in questionnaire
    const all = await this.prisma.succession.findMany();
    const match = all.find((s) => {
      try {
        return s.questionnaire?.inviteToken === token;
      } catch (err) {
        return false;
      }
    });

    if (!match) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    await this.prisma.succession.update({
      where: { tenantId: match.tenantId },
      data: {
        readinessScore: 1,
      },
    });

    return { accepted: true, tenantId: match.tenantId };
  }
}
