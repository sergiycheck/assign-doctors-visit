import { Test, TestingModule } from '@nestjs/testing';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';

describe('SlotController', () => {
  let controller: SlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlotController],
      providers: [SlotService],
    }).compile();

    controller = module.get<SlotController>(SlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
