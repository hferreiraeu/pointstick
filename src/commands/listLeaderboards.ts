import { Command } from '../types/Command';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';

const listLeaderboardsCommand: Command = {
  name: 'listleaderboards',
  description: 'Show all leaderboards in the server',
  execute: async (message, args): Promise<void> => {
    const c = Container.getInstance();
    try {
      const server = await c.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      const lbs = await c.leaderboardService.listLeaderboards(server.id);
      if (!lbs.length) {
        await message.reply('No leaderboards found.');
        return;
      }
      await message.reply('Leaderboards:\n' + lbs.map((l) => l.name).join('\n'));
    } catch (err) {
      logError('listLeaderboards', err);
      await message.reply('Failed to list leaderboards.');
    }
  },
};

export default listLeaderboardsCommand;
