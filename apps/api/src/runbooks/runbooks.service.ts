import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateRunbookDto {
  title?: string;
  markdown: string;
  attachments?: any;
}

export interface UpdateRunbookDto extends Partial<CreateRunbookDto> {}

@Injectable()
export class RunbooksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new runbook for a given tenant.
   * @param tenantId ID of the tenant
   * @param dto Data transfer object containing runbook details
   */
  async create(tenantId: number, dto: CreateRunbookDto) {
    return this.prisma.runbook.create({
      data: {
        tenantId,
        title: dto.title,
        markdown: dto.markdown,
        attachments: dto.attachments,
      },
    });
  }

  /**
   * Retrieve all runbooks for a specific tenant.
   */
  findAllByTenant(tenantId: number) {
    return this.prisma.runbook.findMany({ where: { tenantId } });
  }

  /**
   * Retrieve a single runbook by its ID.
   */
  findOne(id: number) {
    return this.prisma.runbook.findUnique({ where: { id } });
  }

  /**
   * Update an existing runbook.
   */
  update(id: number, dto: UpdateRunbookDto) {
    return this.prisma.runbook.update({
      where: { id },
      data: {
        title: dto.title,
        markdown: dto.markdown,
        attachments: dto.attachments,
      },
    });
  }

  /**
   * Remove a runbook by its ID.
   */
  remove(id: number) {
    return this.prisma.runbook.delete({ where: { id } });
  }
}
