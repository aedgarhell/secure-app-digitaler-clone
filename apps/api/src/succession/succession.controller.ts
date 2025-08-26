import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SuccessionService } from './succession.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller exposing endpoints to get and set succession information and
 * manage successor invitations.
 */
@Controller('succession')
export class SuccessionController {
  constructor(private readonly successionService: SuccessionService) {}

  /**
   * Update the succession details for the authenticated user's tenant.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async set(@Req() req, @Body() body) {
    const tenantId = req.user.tenantId;
    const { successorEmail, questionnaire, readinessScore } = body;
    return this.successionService.setSuccession(
      tenantId,
      successorEmail,
      questionnaire,
      readinessScore,
    );
  }

  /**
   * Get the succession details for the authenticated user's tenant.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Req() req) {
    const tenantId = req.user.tenantId;
    return this.successionService.getSuccession(tenantId);
  }

  /**
   * Invite a successor for the authenticated user's tenant. Returns a token.
   */
  @UseGuards(JwtAuthGuard)
  @Post('invite')
  async invite(@Req() req, @Body() body) {
    const tenantId = req.user.tenantId;
    const { successorEmail } = body;
    return this.successionService.inviteSuccessor(tenantId, successorEmail);
  }

  /**
   * Accept a succession invitation using the provided token. This endpoint
   * does not require authentication since the successor may not have an
   * account yet.
   */
  @Post('accept/:token')
  async accept(@Param('token') token: string) {
    return this.successionService.acceptSuccessor(token);
  }
}
