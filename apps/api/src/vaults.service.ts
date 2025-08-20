import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VaultsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.VaultCreateInput) {
    return this.prisma.vault.create({ data });
  }

  findAll() {
    return this.prisma.vault.findMany();
  }

  findOne(id: number) {
    return this.prisma.vault.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.VaultUpdateInput) {
    return this.prisma.vault.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.vault.delete({ where: { id } });
  }
}