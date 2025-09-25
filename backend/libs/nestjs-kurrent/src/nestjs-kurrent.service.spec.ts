import { Test, TestingModule } from '@nestjs/testing';
import { NestjsKurrentService } from './nestjs-kurrent.service';

describe('NestjsKurrentService', () => {
  let service: NestjsKurrentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestjsKurrentService],
    }).compile();

    service = module.get<NestjsKurrentService>(NestjsKurrentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
