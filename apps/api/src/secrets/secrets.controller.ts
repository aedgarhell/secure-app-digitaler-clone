import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { CreateSecretDto } from './dto/create-secret.dto';
import { UpdateSecretDto } from './dto/update-secret.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * SecretsController provides REST endpoints for managing secrets. All operations
 * require a valid JWT token.
 */
@UseGuards(JwtAuthGuard)
@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  /**
   * Creates a new secret. Expects a JSON payload containing vaultId, type,
   * fields and optional tags.
   */
  @Post()
  create(@Body() dto: CreateSecretDto) {
    return this.secretsService.create(dto);
  }

  /**
   * Lists all secrets belonging to the given vault.
   */
  @Get('vault/:vaultId')
  findAllByVault(@Param('vaultId') vaultId: string) {
    return this.secretsService.findAllByVault(+vaultId);
  }

  /**
   * Retrieves metadata of a single secret (without decrypting it).
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.secretsService.findOne(+id);
  }

  /**
   * Retrieves and decrypts the secret payload.
   */
  @Get(':id/decrypt')
  decrypt(@Param('id') id: string) {
    return this.secretsService.decrypt(+id);
  }

  /**
   * Updates the secret metadata or payload.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSecretDto) {
    return this.secretsService.update(+id, dto);
  }

  /**
   * Deletes a secret permanently.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.secretsService.remove(+id);
  }
}
