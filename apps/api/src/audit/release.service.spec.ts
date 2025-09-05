import { ReleaseService } from '../apps/api/src/release/release.service';
import { PrismaService } from '../apps/api/src/prisma/prisma.service';
import { SecretsService } from '../apps/api/src/secrets/secrets.service';
import { RunbooksService } from '../apps/api/src/runbooks/runbooks.service';

// Unit tests for ReleaseService
describe('ReleaseService', () => {
  let service: ReleaseService;
  let prisma: any;
  let secretsService: any;
  let runbooksService: any;

  beforeEach(() => {
    prisma = {
      release: {
        findUnique: jest.fn().mockResolvedValue({ id: 1, tenantId: 2, status: 'pending' }),
        update: jest.fn().mockResolvedValue({ id: 1, status: 'distributed' }),
      },
    };
    secretsService = {
      findAllByTenant: jest.fn().mockResolvedValue([{ id: 1, name: 'secret1', value: { data: 'value' } }]),
    };
    runbooksService = {
      findAllByTenant: jest.fn().mockResolvedValue([{ id: 1, title: 'runbook1', content: 'content' }]),
    };
    service = new ReleaseService(
      prisma as unknown as PrismaService,
      secretsService as unknown as SecretsService,
      runbooksService as unknown as RunbooksService,
    );
  });

  it('should distribute a release to successor', async () => {
    const result = await service.distributeRelease(1);
    expect(prisma.release.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(secretsService.findAllByTenant).toHaveBeenCalledWith(2);
    expect(runbooksService.findAllByTenant).toHaveBeenCalledWith(2);
    expect(prisma.release.update).toHaveBeenCalled();
    expect(result.secrets.length).toBe(1);
    expect(result.runbooks.length).toBe(1);
  });
});
