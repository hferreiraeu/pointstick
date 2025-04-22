import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';
import { Message } from 'discord.js';

const createLeaderboardCommand: Command = {
  name: 'createleaderboard',
  description: 'Create a new leaderboard',
  usage: `${PREFIX}createleaderboard <name>`,
  requireAdmin: true,
  execute: async (message: Message, args: string[]): Promise<void> => {
    const name = args[0];
    if (!name) {
      await message.reply(`Usage: ${PREFIX}createLeaderboard <name>`);
      return;
    }
    const c = Container.getInstance();
    try {
      const server = await c.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      await c.leaderboardService.createLeaderboard(server.id, name);
      await message.reply(`✅ Leaderboard "${name}" created!`);
    } catch (err) {
      logError('createLeaderboard', err);
      await message.reply('❌ Failed to create leaderboard.');
    }
  },
};

export default createLeaderboardCommand;
