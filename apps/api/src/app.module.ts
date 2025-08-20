import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SecretsModule } from './secrets/secrets.module';
import { VaultsModule } from './vaults/vaults.module';

@Module({
  imports: [UsersModule, AuthModule, SecretsModule, VaultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
