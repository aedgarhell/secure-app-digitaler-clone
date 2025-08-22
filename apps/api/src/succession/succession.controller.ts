import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SuccessionService } from './succession.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller exposing endpoints to get and set succession information.
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
}