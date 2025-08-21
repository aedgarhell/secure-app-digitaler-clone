import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { HeartbeatService } from './heartbeat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Controller providing a heartbeat endpoint to update lastPing.
 */
@Controller('heartbeat')
export class HeartbeatController {
  constructor(private readonly heartbeatService: HeartbeatService) {}

  /**
   * Endpoint for clients to ping the service.
   * Requires authentication; uses the JWT token to derive the user ID.
   */
  @UseGuards(JwtAuthGuard)
  @Post('ping')
  async ping(@Req() req) {
    const userId = req.user.id;
    return this.heartbeatService.ping(userId);
  }
}