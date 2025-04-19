import { Command } from '../types/Command';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';

const createLeaderboardCommand: Command = {
  name: 'createleaderboard',
  description: 'Create a new leaderboard',
  execute: async (message, args): Promise<void> => {
    const name = args[0];
    if (!name) {
      await message.reply('Usage: !createLeaderboard <name>');
      return;
    }
    const c = Container.getInstance();
    try {
      const server = await c.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      await c.leaderboardService.createLeaderboard(server.id, name);
      await message.reply(`Leaderboard "${name}" created!`);
    } catch (err) {
      logError('createLeaderboard', err);
      await message.reply('Failed to create leaderboard.');
    }
  },
};

export default createLeaderboardCommand;
