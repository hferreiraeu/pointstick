import { PrismaClient } from '@prisma/client';

export class PointHistoryService {
  constructor(private prisma: PrismaClient) {}

  async getPointHistory(memberId: string) {
    return this.prisma.pointHistory.findMany({
      where: { memberId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
