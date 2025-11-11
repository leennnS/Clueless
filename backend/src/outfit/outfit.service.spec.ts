import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Outfit } from './outfit.entity';
import { OutfitService } from './outfit.service';

describe('OutfitService', () => {
  let service: OutfitService;
  let repo: jest.Mocked<Repository<Outfit>>;

  beforeEach(async () => {
    const repoMock: Partial<Record<keyof Repository<Outfit>, any>> = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutfitService,
        { provide: getRepositoryToken(Outfit), useValue: repoMock },
      ],
    }).compile();

    service = module.get<OutfitService>(OutfitService);
    repo = module.get(getRepositoryToken(Outfit));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
