import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';
import { Message } from 'discord.js';

const deleteLeaderboardCommand: Command = {
  name: 'deleteleaderboard',
  description: 'Remove a leaderboard and its data',
  usage: `${PREFIX}deleteleaderboard <name>`,
  requireAdmin: true,
  execute: async (message: Message, args: string[]): Promise<void> => {
    const [boardName] = args;
    if (!boardName) {
      await message.reply(`Usage: ${PREFIX}deleteLeaderboard <name>`);
      return;
    }
    const c = Container.getInstance();
    try {
      const server = await c.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      const lb = await c.leaderboardService.getLeaderboard(
        server.id,
        boardName
      );
      if (!lb) {
        await message.reply(`❌ No leaderboard "${boardName}"`);
        return;
      }
      await c.leaderboardService.deleteLeaderboard(lb.id);
      await message.reply(`✅ "${boardName}" deleted.`);
    } catch (err) {
      logError('deleteLeaderboard', err);
      await message.reply('❌ Failed to delete leaderboard.');
    }
  },
};

export default deleteLeaderboardCommand;
