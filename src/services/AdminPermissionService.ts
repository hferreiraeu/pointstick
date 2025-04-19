import { PrismaService } from './PrismaService';

export class AdminPermissionService {
  private prisma = PrismaService.getInstance().client;

  async grantAdminPermission(serverId: string, discordId: string) {
    return this.prisma.adminPermission.create({
      data: { serverId, discordId },
    });
  }

  async revokeAdminPermission(serverId: string, discordId: string) {
    return this.prisma.adminPermission.deleteMany({
      where: { serverId, discordId },
    });
  }

  async isAdmin(serverId: string, discordId: string) {
    const record = await this.prisma.adminPermission.findFirst({
      where: { serverId, discordId },
    });
    return Boolean(record);
  }
}
