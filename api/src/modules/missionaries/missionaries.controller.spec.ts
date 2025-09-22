import { Test, TestingModule } from '@nestjs/testing';
import { MissionariesController } from './missionaries.controller';
import { MissionariesService } from './missionaries.service';

describe('MissionariesController', () => {
  let controller: MissionariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionariesController],
      providers: [MissionariesService],
    }).compile();

    controller = module.get<MissionariesController>(MissionariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
