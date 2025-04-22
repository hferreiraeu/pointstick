import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';
import { Message } from 'discord.js';

const revokeAdminCommand: Command = {
  name: 'revokeadmin',
  description: 'Revoke bot admin permissions from a member',
  usage: `${PREFIX}revokeadmin @member`,
  requireAdmin: true,
  execute: async (message: Message, args: string[]): Promise<void> => {
    const mention = args[0];
    const discordId = mention?.replace(/[<@!>]/g, '');
    if (!discordId) {
      await message.reply(`Usage: ${PREFIX}revokeAdmin @member`);
      return;
    }
    const c = Container.getInstance();
    try {
      const server = await c.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      await c.adminPermissionService.revokeAdminPermission(
        server.id,
        discordId
      );
      await message.reply(`✅ Revoked permissions from <@${discordId}>.`);
    } catch (err) {
      logError('revokeAdmin', err);
      await message.reply('❌ Failed to revoke permissions.');
    }
  },
};

export default revokeAdminCommand;
