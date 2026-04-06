import { Test, TestingModule } from '@nestjs/testing';
import { FinancialRecordService } from './financial-record.service';

describe('FinancialRecordService', () => {
  let service: FinancialRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialRecordService],
    }).compile();

    service = module.get<FinancialRecordService>(FinancialRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
