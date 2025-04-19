import { Command } from '../types/Command';
import { Container } from '../services/Container';
import { logError } from '../utils/logger';

const addMemberCommand: Command = {
  name: 'addmember',
  description: 'Add a member to a leaderboard',
  execute: async (message, args): Promise<void> => {
    const [boardName, mention] = args;
    const discordId = mention?.replace(/[<@!>]/g, '');
    if (!boardName || !discordId) {
      await message.reply('Usage: !addMember <leaderboard_name> @member');
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
      await c.memberService.addMemberToLeaderboard(lb.id, discordId);
      await message.reply(`Added <@${discordId}> to "${boardName}".`);
    } catch (err) {
      logError('addMember', err);
      await message.reply('Failed to add member.');
    }
  },
};

export default addMemberCommand;
