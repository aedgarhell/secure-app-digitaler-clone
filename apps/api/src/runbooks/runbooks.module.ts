import { Module } from '@nestjs/common';
import { RunbooksService } from './runbooks.service';
import { RunbooksController } from './runbooks.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RunbooksController],
  providers: [RunbooksService, PrismaService],
})
export class RunbooksModule {}
