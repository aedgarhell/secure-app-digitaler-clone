import { SecretsService } from '../apps/api/src/secrets/secrets.service';
import { EncryptionService } from '../apps/api/src/encryption/encryption.service';
import { PrismaService } from '../apps/api/src/prisma/prisma.service';

// Unit tests for SecretsService
describe('SecretsService', () => {
  let service: SecretsService;
  let prisma: any;
  let encryption: any;

  beforeEach(() => {
    prisma = {
      secret: {
        create: jest.fn().mockResolvedValue({ id: 1, name: 'test', type: 'PASSWORD', tags: [], encBlob: 'encrypted' }),
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: 1, name: 'test', type: 'PASSWORD', tags: [], encBlob: 'encrypted' }),
      },
    };

    encryption = {
      encrypt: jest.fn().mockReturnValue('encrypted'),
      decrypt: jest.fn().mockReturnValue({ data: 'value' }),
    };

    service = new SecretsService(prisma as unknown as PrismaService, encryption as unknown as EncryptionService);
  });

  it('should encrypt and store a secret on create', async () => {
    await service.create({ name: 'test', type: 'PASSWORD', value: { data: 'value' }, tags: [] });
    expect(encryption.encrypt).toHaveBeenCalled();
    expect(prisma.secret.create).toHaveBeenCalled();
  });

  it('should retrieve and decrypt a secret', async () => {
    const secret = await service.findOne(1);
    expect(prisma.secret.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(encryption.decrypt).toHaveBeenCalledWith('encrypted');
    expect(secret).toHaveProperty('value');
  });
});
