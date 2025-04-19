import { Command } from '../types/Command';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';

const resetPointsCommand: Command = {
  name: 'resetpoints',
  description: 'Set all points in a leaderboard to 0',
  execute: async (message, args): Promise<void> => {
    const [boardName] = args;
    if (!boardName) {
      await message.reply('Usage: !resetPoints <leaderboard_name>');
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
        await message.reply(`No leaderboard "${boardName}"`);
        return;
      }
      await c.memberService.resetPoints(lb.id);
      await message.reply(`All points in "${boardName}" reset to 0.`);
    } catch (err) {
      logError('resetPoints', err);
      await message.reply('Failed to reset points.');
    }
  },
};

export default resetPointsCommand;
