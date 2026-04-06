import { Injectable } from '@nestjs/common';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FinancialRecordService {

  constructor(private prismaService: PrismaService) { }

  async create(userId: string, createFinancialRecordDto: CreateFinancialRecordDto) {
    const { amount, date, category, type, notes } = createFinancialRecordDto;

    const newRecord = {
      amount,
      date,
      category,
      type,
      notes,
    };

    // Here you would typically save the newRecord to a database
    const createdRecord = await this.prismaService.financialRecord.create({
      data: {
        userId,
        amount,
        date: new Date(date),   // convert ISO string to Date object
        category,
        type,
        notes,
      },
    });

    return createdRecord;
  }

  findAll(userId: string) {
    return this.prismaService.financialRecord.findMany({
      where: { userId, isDeleted: false },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: string, userId: string) {
    return this.prismaService.financialRecord.findFirst({
      where: { id, userId, isDeleted: false },
    });
  }

  update(id: string, userId: string, updateFinancialRecordDto: UpdateFinancialRecordDto) {
    const { date, ...rest } = updateFinancialRecordDto;

    return this.prismaService.financialRecord.update({
      where: { id },
      data: {
        ...rest,
        ...(date && { date: new Date(date) }),
      },
    });
  }

  remove(id: string, userId: string) {
    return this.prismaService.financialRecord.update({
      where: { id, userId },
      data: { isDeleted: true },
    });
  }
}
