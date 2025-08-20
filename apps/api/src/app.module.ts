import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SecretsModule } from './secrets/secrets.module';
import { VaultsModule } from './vaults/vaults.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { RunbooksModule } from './runbooks/runbooks.module';

@Module({
  imports: [UsersModule, AuthModule, SecretsModule, VaultsModule, OnboardingModule, RunbooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
