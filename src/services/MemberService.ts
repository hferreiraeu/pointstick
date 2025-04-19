import { PrismaService } from './PrismaService';

export class MemberService {
  private prisma = PrismaService.getInstance().client;

  async addMemberToLeaderboard(leaderboardId: string, discordId: string) {
    return this.prisma.member.upsert({
      where: {
        leaderboardId_discordId: {
          leaderboardId,
          discordId,
        },
      },
      update: {},
      create: {
        leaderboardId,
        discordId,
        points: 0,
      },
    });
  }

  async modifyPoints(
    leaderboardId: string,
    discordId: string,
    points: number,
    description: string
  ) {
    const member = await this.prisma.member.findUnique({
      where: {
        leaderboardId_discordId: {
          leaderboardId,
          discordId,
        },
      },
    });
    if (!member) throw new Error('Member not found.');

    const updated = await this.prisma.member.update({
      where: { id: member.id },
      data: { points: { increment: points } },
    });

    await this.prisma.pointHistory.create({
      data: {
        memberId: member.id,
        points,
        description,
      },
    });

    return updated;
  }

  async getMembers(leaderboardId: string) {
    return this.prisma.member.findMany({
      where: { leaderboardId },
      select: { discordId: true, points: true },
      orderBy: { points: 'desc' },
    });
  }

  async resetPoints(leaderboardId: string) {
    return this.prisma.member.updateMany({
      where: { leaderboardId },
      data: { points: 0 },
    });
  }
}
