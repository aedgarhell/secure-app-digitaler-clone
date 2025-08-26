import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller exposing release status and completion endpoints.
 */
@Controller('release')
export class ReleaseController {
  constructor(private readonly releaseService: ReleaseService) {}

  /**
   * Returns the latest release for the authenticated user's tenant.
   */
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@Req req) {
    const tenantId = req.user.tenantId;
    return this.releaseService.getLatestRelease(tenantId);
  }

  /**
   * Completes a release by ID. Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Post('complete/:id')
  async complete(@Param('id') id: string) {
    return this.releaseService.completeRelease(Number(id));
  }
}
