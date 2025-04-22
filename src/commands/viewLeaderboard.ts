import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Container } from '../services/Container';
import { buildLeaderboardEmbed } from '../utils/embedBuilder';
import { logError } from '../utils/logger';
import { Message } from 'discord.js';

const viewLeaderboardCommand: Command = {
  name: 'viewleaderboard',
  description: 'Display all members and their points',
  usage: `${PREFIX}viewleaderboard <leaderboard_name>`,
  execute: async (message: Message, args: string[]): Promise<void> => {
    const [boardName] = args;
    if (!boardName) {
      await message.reply(`Usage: ${PREFIX}viewLeaderboard <name>`);
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

      // Get members sorted by points
      const members = await c.memberService.getMembers(lb.id);
      if (members.length === 0) {
        await message.reply(`"${boardName}" is empty.`);
        return;
      }

      // Build embed entries with display names
      const entries = await Promise.all(
        members.map(async (m, i) => {
          let displayName: string;
          try {
            // displayName uses nickname if set, otherwise username
            const guildMember = await message.guild!.members.fetch(m.discordId);
            displayName = guildMember.displayName;
          } catch {
            // Fallback if member not found (e.g., left the server)
            displayName = `<@${m.discordId}>`;
          }
          return {
            name: `${i + 1}. ${displayName}`,
            value: `${m.points} points`,
          };
        })
      );

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
