import { Command } from '../types/Command';
import { Container } from '../services/Container';
import { buildLeaderboardEmbed } from '../utils/embedBuilder';
import { logError } from '../utils/logger';

const viewLeaderboardCommand: Command = {
  name: 'viewleaderboard',
  description: 'Display all members and their points',
  execute: async (message, args): Promise<void> => {
    const [boardName] = args;
    if (!boardName) {
      await message.reply('Usage: !viewLeaderboard <name>');
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
      const members = await c.memberService.getMembers(lb.id);
      if (!members.length) {
        await message.reply(`"${boardName}" is empty.`);
        return;
      }
      const entries = members.map((m, i) => ({
        name: `${i + 1}. <@${m.discordId}>`,
        value: `${m.points} points`,
      }));
      const embed = buildLeaderboardEmbed(
        `Leaderboard: ${boardName}`,
        entries
      );
      await message.reply({ embeds: [embed] });
    } catch (err) {
      logError('viewLeaderboard', err);
      await message.reply('Failed to view leaderboard.');
    }
  },
};

export default viewLeaderboardCommand;
