import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../encryption/encryption.service';
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
   * Creates a new secret. The provided fields are encrypted before stored.
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
   * Returns all secrets for a vault, decrypting each record.
   */
  async findAllByVault(vaultId: number) {
    const secrets = await this.prisma.secret.findMany({
      where: { vaultId },
    });

    return secrets.map((secret) => {
      const enc = JSON.parse(secret.encBlob);
      const fields = this.encryption.decrypt(enc);
      return {
        id: secret.id,
        vaultId: secret.vaultId,
        type: secret.type,
        tags: secret.tags,
        fields,
      };
    });
  }

  /**
   * Returns all secrets for all vaults belonging to a tenant. This is useful
   * when preparing a data handover for a release.
   */
  async findAllByTenant(tenantId: number) {
    // fetch all vaults for the tenant and include their secrets
    const vaults = await this.prisma.vault.findMany({
      where: { tenantId },
      include: { secrets: true },
    });

    const result: any[] = [];
    for (const vault of vaults) {
      for (const secret of vault.secrets) {
        const enc = JSON.parse(secret.encBlob);
        const fields = this.encryption.decrypt(enc);
        result.push({
          id: secret.id,
          vaultId: secret.vaultId,
          type: secret.type,
          tags: secret.tags,
          fields,
        });
      }
    }
    return result;
  }

  /**
   * Returns a single secret by ID, decrypting its contents.
   */
  async findOne(id: number) {
    const secret = await this.prisma.secret.findUnique({
      where: { id },
    });

    if (!secret) {
      throw new NotFoundException(`Secret with id ${id} not found`);
    }

    const enc = JSON.parse(secret.encBlob);
    const fields = this.encryption.decrypt(enc);

    return {
      id: secret.id,
      vaultId: secret.vaultId,
      type: secret.type,
      tags: secret.tags,
      fields,
    };
  }

  /**
   * Decrypts a secret entity's encBlob field and returns the plain fields.
   */
  async decrypt(secret: { encBlob: string }) {
    const enc = JSON.parse(secret.encBlob);
    return this.encryption.decrypt(enc);
  }

  /**
   * Updates a secret. Only provided properties are modified. If fields
   * are provided, they will be re-encrypted.
   */
  async update(id: number, data: UpdateSecretDto) {
    const secret = await this.prisma.secret.findUnique({
      where: { id },
    });
    if (!secret) {
      throw new NotFoundException(`Secret with id ${id} not found`);
    }

    // only encrypt fields if provided
    let encBlob: string | undefined;
    if (data.fields) {
      encBlob = JSON.stringify(this.encryption.encrypt(data.fields));
    }

    const updated = await this.prisma.secret.update({
      where: { id },
      data: {
        type: data.type ?? undefined,
        tags: data.tags ?? undefined,
        encBlob: encBlob ?? undefined,
      },
    });

    const enc = JSON.parse(updated.encBlob);
    const fields = this.encryption.decrypt(enc);

    return {
      id: updated.id,
      vaultId: updated.vaultId,
      type: updated.type,
      tags: updated.tags,
      fields,
    };
  }

  /**
   * Deletes a secret.
   */
  async remove(id: number) {
    await this.prisma.secret.delete({ where: { id } });
    return { deleted: true };
  }
}
