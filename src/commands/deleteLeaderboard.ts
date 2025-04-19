import { Command } from '../types/Command';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';

const deleteLeaderboardCommand: Command = {
  name: 'deleteleaderboard',
  description: 'Remove a leaderboard and its data',
  requireAdmin: true,
  execute: async (message, args): Promise<void> => {
    const [boardName] = args;
    if (!boardName) {
      await message.reply('Usage: !deleteLeaderboard <name>');
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
