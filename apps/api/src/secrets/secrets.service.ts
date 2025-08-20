import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../encryption/encryption.service';
import { Prisma } from '@prisma/client';
import { CreateSecretDto } from './dto/create-secret.dto';
import { UpdateSecretDto } from './dto/update-secret.dto';

/**
 * SecretsService handles CRUD operations for secrets, including encryption and
 * decryption of the secret payloads.
 */
@Injectable()
export class SecretsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  /**
   * Creates a new secret. The provided fields are encrypted before being stored.
   */
  async create(data: CreateSecretDto) {
    const enc = this.encryption.encrypt(data.fields);
    return this.prisma.secret.create({
      data: {
        vaultId: data.vaultId,
        type: data.type,
        tags: data.tags ?? [],
        encBlob: JSON.stringify(enc),
      },
    });
  }

  /**
   * Lists all secrets belonging to a given vault.
   */
  async findAllByVault(vaultId: number) {
    return this.prisma.secret.findMany({ where: { vaultId } });
  }

  /**
   * Retrieves a secret by its identifier (without decrypting it).
   */
  async findOne(id: number) {
    const secret = await this.prisma.secret.findUnique({ where: { id } });
    if (!secret) {
      throw new NotFoundException('Secret not found');
    }
    return secret;
  }

  /**
   * Decrypts and returns the secret payload for a given secret.
   */
  async decrypt(id: number) {
    const secret = await this.findOne(id);
    const enc = JSON.parse(secret.encBlob);
    return this.encryption.decrypt(enc);
  }

  /**
   * Updates a secret. If fields are provided, they are encrypted and the version
   * counter is incremented.
   */
  async update(id: number, dto: UpdateSecretDto) {
    const data: Prisma.SecretUpdateInput = {};
    if (dto.type !== undefined) {
      data.type = dto.type;
    }
    if (dto.tags !== undefined) {
      data.tags = dto.tags;
    }
    if (dto.fields !== undefined) {
      const enc = this.encryption.encrypt(dto.fields);
      data.encBlob = JSON.stringify(enc);
      data.version = {
        increment: 1,
      };
    }
    return this.prisma.secret.update({ where: { id }, data });
  }

  /**
   * Deletes a secret by its identifier.
   */
  async remove(id: number) {
    return this.prisma.secret.delete({ where: { id } });
  }
}
