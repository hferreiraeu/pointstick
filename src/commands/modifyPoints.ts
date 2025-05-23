import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';
import { Message } from 'discord.js';

const modifyPointsCommand: Command = {
  name: 'modifypoints',
  description: 'Add or remove points for a member',
  usage: `${PREFIX}modifypoints <leaderboard_name> @member <points> <description>`,
  requireAdmin: true,
  execute: async (message: Message, args: string[]): Promise<void> => {
    const [boardName, mention, ptsStr, ...desc] = args;
    const discordId = mention?.replace(/[<@!>]/g, '');
    const points = parseInt(ptsStr, 10);
    const description = desc.join(' ');
    if (!boardName || !discordId || isNaN(points) || !description) {
      await message.reply(
        `Usage: ${PREFIX}modifyPoints <leaderboard_name> @member <points> <description>`
      );
      return;
    }

    const c = Container.getInstance();
    try {
      // Ensure server record exists
      const server = await c.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );

      // Fetch the leaderboard
      const lb = await c.leaderboardService.getLeaderboard(
        server.id,
        boardName
      );
      if (!lb) {
        await message.reply(`❌ No leaderboard "${boardName}"`);
        return;
      }

      // Modify points (service expects 4 args)
      const updated = await c.memberService.modifyPoints(
        lb.id,
        discordId,
        points,
        description
      );

      await message.reply(
        `✅ <@${discordId}> now has ${updated.points} points in "${boardName}".`
      );
    } catch (err) {
      logError('modifyPoints', err);
      await message.reply('❌ Failed to modify points.');
    }
  },
};

export default modifyPointsCommand;
