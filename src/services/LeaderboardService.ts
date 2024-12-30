import { PrismaClient } from '@prisma/client';

export class LeaderboardService {
  constructor(private prisma: PrismaClient) {}

  async createLeaderboard(serverId: string, name: string) {
    return this.prisma.leaderboard.create({
      data: { serverId, name },
    });
  }

  async getLeaderboard(serverId: string, name: string) {
    return this.prisma.leaderboard.findFirst({
      where: { serverId, name },
    });
  }
}
