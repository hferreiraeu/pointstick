import { PrismaClient } from '@prisma/client';

export class AdminPermissionService {
  constructor(private prisma: PrismaClient) {}

  async grantAdminPermission(serverId: string, discordId: string) {
    return this.prisma.adminPermission.create({
      data: {
        serverId,
        discordId,
      },
    });
  }

  async revokeAdminPermission(serverId: string, discordId: string) {
    return this.prisma.adminPermission.deleteMany({
      where: {
        serverId,
        discordId,
      },
    });
  }

  async isAdmin(serverId: string, discordId: string) {
    const admin = await this.prisma.adminPermission.findFirst({
      where: {
        serverId,
        discordId,
      },
    });
    return !!admin;
  }
}
