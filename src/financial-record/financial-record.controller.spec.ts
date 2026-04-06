import { Test, TestingModule } from '@nestjs/testing';
import { FinancialRecordController } from './financial-record.controller';
import { FinancialRecordService } from './financial-record.service';

describe('FinancialRecordController', () => {
  let controller: FinancialRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialRecordController],
      providers: [FinancialRecordService],
    }).compile();

    controller = module.get<FinancialRecordController>(FinancialRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
