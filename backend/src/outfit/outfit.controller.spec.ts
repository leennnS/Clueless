import { Test, TestingModule } from '@nestjs/testing';
import { OutfitController } from './outfit.controller';
import { OutfitService } from './outfit.service';

describe('OutfitController', () => {
  let controller: OutfitController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutfitController],
      providers: [{ provide: OutfitService, useValue: service }],
    }).compile();

    controller = module.get<OutfitController>(OutfitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
