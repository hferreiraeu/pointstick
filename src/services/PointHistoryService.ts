import { PrismaService } from './PrismaService';

export class PointHistoryService {
  private prisma = PrismaService.getInstance().client;

  async getPointHistory(memberId: string) {
    return this.prisma.pointHistory.findMany({
      where: { memberId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
