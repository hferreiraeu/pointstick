import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';
import { Message } from 'discord.js';

const resetPointsCommand: Command = {
  name: 'resetpoints',
  description: 'Set all points in a leaderboard to 0',
  usage: `${PREFIX}resetpoints <leaderboard_name>`,
  requireAdmin: true,
  execute: async (message: Message, args: string[]): Promise<void> => {
    const [boardName] = args;
    if (!boardName) {
      await message.reply(`Usage: ${PREFIX}resetPoints <leaderboard_name>`);
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
      await c.memberService.resetPoints(lb.id);
      await message.reply(`✅ All points in "${boardName}" reset to 0.`);
    } catch (err) {
      logError('resetPoints', err);
      await message.reply('❌ Failed to reset points.');
    }
  },
};

export default resetPointsCommand;
