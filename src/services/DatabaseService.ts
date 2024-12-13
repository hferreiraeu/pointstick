import { PrismaClient } from '@prisma/client';

export class DatabaseService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async getOrCreateServer(discordId: string, name: string) {
    return this.prisma.server.upsert({
      where: { discordId },
      update: {},
      create: { discordId, name },
    });
  }

  async createLeaderboard(serverId: string, name: string) {
    return this.prisma.leaderboard.create({
      data: { serverId, name },
    });
  }

  async addPoints(memberId: string, points: number, description: string) {
    const updatedMember = await this.prisma.member.update({
      where: { id: memberId },
      data: { points: { increment: points } },
    });

    await this.prisma.pointHistory.create({
      data: {
        memberId,
        points,
        description,
      },
    });

    return updatedMember;
  }

  // TODO: Add more methods for permissions, member management, etc.
}