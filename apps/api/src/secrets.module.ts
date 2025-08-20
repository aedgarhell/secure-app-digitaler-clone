import { Module } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { SecretsController } from './secrets.controller';
import { EncryptionService } from '../encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SecretsController],
  providers: [SecretsService, EncryptionService, PrismaService],
})
export class SecretsModule {}