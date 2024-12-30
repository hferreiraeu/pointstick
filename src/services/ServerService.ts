import { PrismaClient } from '@prisma/client';

export class ServerService {
  constructor(private prisma: PrismaClient) {}

  async getOrCreateServer(discordId: string, name: string) {
    return this.prisma.server.upsert({
      where: { discordId },
      update: {},
      create: { discordId, name },
    });
  }
}