import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SecretsModule } from './secrets/secrets.module';
import { VaultsModule } from './vaults/vaults.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { RunbooksModule } from './runbooks/runbooks.module';
import { AuditModule } from './audit/audit.module';
import { ReleaseModule } from './release/release.module';
import { HeartbeatModule } from './heartbeat/heartbeat.module';
import { BrandingModule } from './branding/branding.module';
import { SuccessionModule } from './succession/succession.module';

/**
 * Root module of the API. Registers all feature modules and initializes
 * the scheduler for cron jobs.
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    SecretsModule,
    VaultsModule,
    OnboardingModule,
    RunbooksModule,
    AuditModule,
    ReleaseModule,
    HeartbeatModule,
    BrandingModule,
    SuccessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
