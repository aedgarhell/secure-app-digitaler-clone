import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { BrandingService } from './branding.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller providing endpoints for white‑label branding configuration.
 */
@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  /**
   * Update branding settings for the authenticated user's tenant.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async set(@Req() req, @Body() body) {
    const tenantId = req.user.tenantId;
    return this.brandingService.updateBranding(tenantId, body);
  }

  /**
   * Get branding settings for the authenticated user's tenant.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Req() req) {
    const tenantId = req.user.tenantId;
    return this.brandingService.getBranding(tenantId);
  }
}