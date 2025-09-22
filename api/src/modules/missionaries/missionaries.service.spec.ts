import { Test, TestingModule } from '@nestjs/testing';
import { MissionariesService } from './missionaries.service';

describe('MissionariesService', () => {
  let service: MissionariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionariesService],
    }).compile();

    service = module.get<MissionariesService>(MissionariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
