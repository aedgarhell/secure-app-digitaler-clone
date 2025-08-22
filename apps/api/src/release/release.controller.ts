import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller exposing release status endpoints.
 */
@Controller('release')
export class ReleaseController {
  constructor(private readonly releaseService: ReleaseService) {}

  /**
   * Returns the latest release for the authenticated user's tenant.
   */
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@Req() req) {
    const tenantId = req.user.tenantId;
    return this.releaseService.getLatestRelease(tenantId);
  }
}