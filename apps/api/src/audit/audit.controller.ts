import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
// Role-based access control imports
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

/**
 * Controller exposing audit log retrieval and signature verification endpoints.
 */
// Protect all audit endpoints so that only administrators can access them.
@UseGuards(RolesGuard)
@Roles('ADMIN')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Returns all audit log entries.
   */
  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  /**
   * Returns a single audit log entry by id.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(+id);
  }

  /**
   * Verify a provided signature for an audit entry. The request body must
   * contain actorId, action, target, ts (ISO string) and signature. It
   * returns an object { valid: boolean } indicating whether the signature
   * matches the expected HMAC for the provided data.
   */
  @Post('verify')
  verify(@Body() body: any) {
    const { actorId, action, target, ts, signature } = body;
    const timestamp = new Date(ts);
    const valid = this.auditService.verifySignature(actorId, action, target, timestamp, signature);
    return { valid };
  }

  /**
   * Returns all audit entries for a specific actor.
   * Example: GET /audit/actor/42 returns all actions performed by user 42.
   */
  @Get('actor/:actorId')
  findByActor(@Param('actorId') actorId: string) {
    return this.auditService.findByActor(+actorId);
  }

  /**
   * Returns all audit entries matching a specific action.
   * Example: GET /audit/action/login returns all login actions.
   */
  @Get('action/:action')
  findByAction(@Param('action') action: string) {
    return this.auditService.findByAction(action);
  }
}