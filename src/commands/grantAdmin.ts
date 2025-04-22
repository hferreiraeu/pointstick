import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';
import { Message } from 'discord.js';

const grantAdminCommand: Command = {
  name: 'grantadmin',
  description: 'Grant bot admin permissions to a member',
  usage: `${PREFIX}grantadmin @member`,
  requireAdmin: true,
  execute: async (message: Message, args: string[]): Promise<void> => {
    const mention = args[0];
    const discordId = mention?.replace(/[<@!>]/g, '');
    if (!discordId) {
      await message.reply(`Usage: ${PREFIX}grantAdmin @member`);
      return;
    }
    const c = Container.getInstance();
    try {
      const server = await c.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      await c.adminPermissionService.grantAdminPermission(
        server.id,
        discordId
      );
      await message.reply(`✅ Granted permissions to <@${discordId}>.`);
    } catch (err) {
      logError('grantAdmin', err);
      await message.reply('❌ Failed to grant permissions.');
    }
  },
};

export default grantAdminCommand;
