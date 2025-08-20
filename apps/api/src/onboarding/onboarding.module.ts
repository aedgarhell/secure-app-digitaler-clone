import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { PrismaService } from '../prisma/prisma.service';
import { VaultsService } from '../vaults/vaults.service';
import { SecretsService } from '../secrets/secrets.service';
import { RunbooksService } from '../runbooks/runbooks.service';

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService, PrismaService, VaultsService, SecretsService, RunbooksService],
})
export class OnboardingModule {}
