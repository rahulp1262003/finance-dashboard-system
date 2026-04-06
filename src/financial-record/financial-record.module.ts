import { Module } from '@nestjs/common';
import { FinancialRecordService } from './financial-record.service';
import { FinancialRecordController } from './financial-record.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,JwtModule],
  controllers: [FinancialRecordController],
  providers: [FinancialRecordService],
})
export class FinancialRecordModule { }
