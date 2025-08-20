import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VaultsService } from '../vaults/vaults.service';
import { SecretsService } from '../secrets/secrets.service';
import { RunbooksService } from '../runbooks/runbooks.service';

@Injectable()
export class OnboardingService {
  constructor(
    private prisma: PrismaService,
    private vaultsService: VaultsService,
    private secretsService: SecretsService,
    private runbooksService: RunbooksService,
  ) {}

  async start(data: { tenantName: string; adminEmail: string; adminPassword: string }) {
    // Create tenant and owner user
    const tenant = await this.prisma.tenant.create({
      data: {
        name: data.tenantName,
        users: {
          create: {
            email: data.adminEmail,
            password: data.adminPassword,
            role: 'owner',
          },
        },
      },
    });
    return tenant;
  }

  async getProgress(tenantId: number) {
    // Count vaults, secrets and runbooks for the tenant
    const vaultCount = await this.prisma.vault.count({ where: { tenantId } });
    const secretCount = await this.prisma.secret.count({
      where: { vault: { tenantId } },
    });
    const runbookCount = await this.prisma.runbook.count({ where: { tenantId } });

    let completed = 0;
    const total = 3;
    if (vaultCount > 0) completed++;
    if (secretCount > 0) completed++;
    if (runbookCount > 0) completed++;

    const progress = Math.round((completed / total) * 100);
    return { completed, total, progress };
  }
}
