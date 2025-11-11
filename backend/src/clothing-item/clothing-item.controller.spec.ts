import { Test, TestingModule } from '@nestjs/testing';
import { ClothingItemController } from './clothing-item.controller';

describe('ClothingItemController', () => {
  let controller: ClothingItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClothingItemController],
    }).compile();

    controller = module.get<ClothingItemController>(ClothingItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
