import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) { }

  // GET /api/dashboard/summary
  async getSummary(userId: string) {
    const result = await this.prismaService.financialRecord.groupBy({
      by: ['type'],
      where: { userId, isDeleted: false },
      _sum: { amount: true },
    });

    const totalIncome = Number(
      result.find(r => r.type === 'INCOME')?._sum.amount ?? 0
    );
    const totalExpenses = Number(
      result.find(r => r.type === 'EXPENSE')?._sum.amount ?? 0
    );

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  }

  // GET /api/dashboard/by-category
  async getByCategory(userId: string) {
    const result = await this.prismaService.financialRecord.groupBy({
      by: ['category', 'type'],
      where: { userId, isDeleted: false },
      _sum: { amount: true },
      orderBy: { category: 'asc' },
    });

    // Merge INCOME + EXPENSE rows for same category into one object
    const categoryMap = new Map<string, { income: number; expense: number }>();

    for (const row of result) {
      if (!categoryMap.has(row.category)) {
        categoryMap.set(row.category, { income: 0, expense: 0 });
      }
      const entry = categoryMap.get(row.category)!;
      if (row.type === 'INCOME') {
        entry.income = Number(row._sum.amount ?? 0);
      } else {
        entry.expense = Number(row._sum.amount ?? 0);
      }
    }

    return Array.from(categoryMap.entries()).map(([category, totals]) => ({
      category,
      totalIncome: totals.income,
      totalExpenses: totals.expense,
      net: totals.income - totals.expense,
    }));
  }

  // GET /api/dashboard/trends?period=monthly|weekly
  async getTrends(userId: string, period: 'monthly' | 'weekly' = 'monthly') {
    const result = await this.prismaService.financialRecord.groupBy({
      by: ['date', 'type'],
      where: { userId, isDeleted: false },
      _sum: { amount: true },
      orderBy: { date: 'asc' },
    });

    const trendsMap = new Map<string, { income: number; expense: number }>();

    for (const row of result) {
      const key = period === 'weekly'
        ? formatWeek(new Date(row.date))
        : formatMonth(new Date(row.date));

      if (!trendsMap.has(key)) {
        trendsMap.set(key, { income: 0, expense: 0 });
      }
      const entry = trendsMap.get(key)!;
      if (row.type === 'INCOME') {
        entry.income += Number(row._sum.amount ?? 0);
      } else {
        entry.expense += Number(row._sum.amount ?? 0);
      }
    }

    return Array.from(trendsMap.entries()).map(([period, totals]) => ({
      period,
      totalIncome: totals.income,
      totalExpenses: totals.expense,
      net: totals.income - totals.expense,
    }));
  }
  // GET /api/dashboard/recent
  async getRecent(userId: string) {
    return this.prismaService.financialRecord.findMany({
      where: { userId, isDeleted: false },
      orderBy: { date: 'desc' },
      take: 10,
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        notes: true,
        createdAt: true,
      },
    });
  }
}

// Helper: format Date → "2026-04"
function formatMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Helper: format Date → "2026-W14"
function formatWeek(date: Date): string {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
}