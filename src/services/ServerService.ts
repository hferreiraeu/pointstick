import { PrismaService } from './PrismaService';

export class ServerService {
  private prisma = PrismaService.getInstance().client;

  async getOrCreateServer(discordId: string, name: string) {
    return this.prisma.server.upsert({
      where: { discordId },
      update: {},
      create: { discordId, name },
    });
  }
}
