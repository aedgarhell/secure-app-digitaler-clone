import { Module } from '@nestjs/common';
import { VaultsService } from './vaults.service';
import { VaultsController } from './vaults.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [VaultsController],
  providers: [VaultsService, PrismaService],
})
export class VaultsModule {}
