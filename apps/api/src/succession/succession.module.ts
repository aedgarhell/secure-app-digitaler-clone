import { Module } from '@nestjs/common';
import { SuccessionService } from './succession.service';
import { SuccessionController } from './succession.controller';
import { PrismaService } from '../prisma/prisma.service';

/**
 * SuccessionModule provides services and controllers for
 * managing firm succession information.
 */
@Module({
  controllers: [SuccessionController],
  providers: [SuccessionService, PrismaService],
  exports: [SuccessionService],
})
export class SuccessionModule {}
