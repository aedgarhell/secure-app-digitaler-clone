import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RunbooksService, CreateRunbookDto, UpdateRunbookDto } from './runbooks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('runbooks')
export class RunbooksController {
  constructor(private readonly runbooksService: RunbooksService) {}

  /**
   * Create a runbook for a tenant. Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Post(':tenantId')
  create(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreateRunbookDto,
  ) {
    return this.runbooksService.create(+tenantId, dto);
  }

  /**
   * List all runbooks for a tenant. Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':tenantId')
  findAll(@Param('tenantId') tenantId: string) {
    return this.runbooksService.findAllByTenant(+tenantId);
  }

  /**
   * Retrieve a single runbook by ID. Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.runbooksService.findOne(+id);
  }

  /**
   * Update a runbook by ID. Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRunbookDto) {
    return this.runbooksService.update(+id, dto);
  }

  /**
   * Delete a runbook by ID. Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runbooksService.remove(+id);
  }
}
