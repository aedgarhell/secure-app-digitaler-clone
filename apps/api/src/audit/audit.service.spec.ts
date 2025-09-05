import { AuditService } from '../apps/api/src/audit/audit.service';
import { PrismaService } from '../apps/api/src/prisma/prisma.service';

// Unit tests for AuditService
describe('AuditService', () => {
  let auditService: AuditService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      auditLog: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          actor: '1',
          action: 'TEST',
          target: 'target',
          signature: 'signature',
          timestamp: new Date(),
        }),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    auditService = new AuditService(prisma as unknown as PrismaService);
  });

  it('should log an entry with a signature', async () => {
    const result = await auditService.log('1', 'TEST', 'target');
    expect(prisma.auditLog.create).toHaveBeenCalled();
    expect(result).toHaveProperty('signature');
  });

  it('should retrieve logs by actor ID', async () => {
    await auditService.findByActor(1);
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith({ where: { actor: '1' } });
  });

  it('should retrieve logs by action', async () => {
    await auditService.findByAction('TEST');
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith({ where: { action: 'TEST' } });
  });
});
