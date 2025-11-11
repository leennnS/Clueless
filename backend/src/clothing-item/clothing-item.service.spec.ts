import { Test, TestingModule } from '@nestjs/testing';
import { ClothingItemService } from './clothing-item.service';

describe('ClothingItemService', () => {
  let service: ClothingItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClothingItemService],
    }).compile();

    service = module.get<ClothingItemService>(ClothingItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
