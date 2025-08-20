import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { VaultsService } from './vaults.service';
import { Prisma } from '@prisma/client';

@Controller('vaults')
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @Post()
  create(@Body() data: Prisma.VaultCreateInput) {
    return this.vaultsService.create(data);
  }

  @Get()
  findAll() {
    return this.vaultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vaultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.VaultUpdateInput) {
    return this.vaultsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vaultsService.remove(+id);
  }
}
