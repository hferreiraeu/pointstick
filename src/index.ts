import { Client, GatewayIntentBits } from 'discord.js';
import { Container } from './services/Container';
import { config } from 'dotenv';

// Load environment variables
config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Access services from the container
const container = Container.getInstance();

// List of commands and their descriptions
const commands = [
  { command: '!hello', description: 'Greets the user.' },
  { command: '!createLeaderboard <name>', description: 'Creates a new leaderboard with the specified name.' },
  { command: '!addMember <leaderboard_name> @member', description: 'Adds a member to the specified leaderboard.' },
  { command: '!modifyPoints <leaderboard_name> @member <points> <description>', description: 'Adds or removes points for a member.' },
  { command: '!help', description: 'Displays a list of available commands.' },
];

client.once('ready', () => {
  console.log('Bot is online!');
});

// Respond to !help command
client.on('messageCreate', (message) => {
  if (message.content === '!help') {
    const helpMessage = commands
      .map((cmd) => `${cmd.command} - ${cmd.description}`)
      .join('\n');
    message.reply(`Here are the available commands:\n\`\`\`\n${helpMessage}\n\`\`\``);
  }
});

// For testing
client.on('messageCreate', (message) => {
  if (message.content === '!hello') {
    message.reply('Hello, I am Point Stick!');
  }
});

// Create a leaderboard
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!createLeaderboard')) {
    const args = message.content.split(' ');
    const leaderboardName = args[1];

    if (!leaderboardName) {
      return message.reply('Please provide a leaderboard name.');
    }

    const serverService = container.serverService;
    const leaderboardService = container.leaderboardService;

    try {
      const server = await serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      await leaderboardService.createLeaderboard(server.id, leaderboardName);

      message.reply(`Leaderboard "${leaderboardName}" created!`);
    } catch (error) {
      console.error('Error creating leaderboard:', error);
      message.reply('An error occurred while creating the leaderboard.');
    }
  }
});

// Add a member to a leaderboard
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!addMember')) {
    const args = message.content.split(' ');
    const leaderboardName = args[1];
    const mentionedUser = args[2];
    const discordId = mentionedUser?.replace(/[<@!>]/g, '');

    if (!leaderboardName || !discordId) {
      return message.reply('Usage: !addMember <leaderboard_name> @member');
    }

    const serverService = container.serverService;
    const leaderboardService = container.leaderboardService;
    const memberService = container.memberService;

    try {
      const server = await serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      const leaderboard = await leaderboardService.getLeaderboard(
        server.id,
        leaderboardName
      );

      if (!leaderboard) {
        return message.reply(`Leaderboard "${leaderboardName}" not found.`);
      }

      await memberService.addMemberToLeaderboard(leaderboard.id, discordId);
      message.reply(
        `Member <@${discordId}> added to leaderboard "${leaderboardName}".`
      );
    } catch (error) {
      console.error('Error adding member:', error);
      message.reply('An error occurred while adding the member.');
    }
  }
});

// View leaderboard
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!viewLeaderboard')) {
    const args = message.content.split(' ');
    const leaderboardName = args[1];

    if (!leaderboardName) {
      return message.reply('Usage: !viewLeaderboard <name>');
    }

    const leaderboardService = container.leaderboardService;
    const memberService = container.memberService;

    try {
      const server = await container.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );

      const leaderboard = await leaderboardService.getLeaderboard(
        server.id,
        leaderboardName
      );

      if (!leaderboard) {
        return message.reply(`Leaderboard "${leaderboardName}" not found.`);
      }

      const members = await memberService.getMembers(leaderboard.id);

      if (members.length === 0) {
        return message.reply(`Leaderboard "${leaderboardName}" is empty.`);
      }

      const leaderboardDisplay = members
        .map(
          (member, index) =>
            `${index + 1}. <@${member.discordId}>: ${member.points} points`
        )
        .join('\n');

      message.reply(`Leaderboard "${leaderboardName}":\n${leaderboardDisplay}`);
    } catch (error) {
      console.error('Error viewing leaderboard:', error);
      message.reply('An error occurred while viewing the leaderboard.');
    }
  }
});

// List leaderboards
client.on('messageCreate', async (message) => {
  if (message.content === '!listLeaderboards') {
    const leaderboardService = container.leaderboardService;

    try {
      const server = await container.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );

      const leaderboards = await leaderboardService.listLeaderboards(server.id);

      if (leaderboards.length === 0) {
        return message.reply('No leaderboards found in this server.');
      }

      const leaderboardNames = leaderboards.map((lb) => lb.name).join('\n');
      message.reply(`Leaderboards in this server:\n${leaderboardNames}`);
    } catch (error) {
      console.error('Error listing leaderboards:', error);
      message.reply('An error occurred while listing leaderboards.');
    }
  }
});

// Delete a leaderboard
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!deleteLeaderboard')) {
    const args = message.content.split(' ');
    const leaderboardName = args[1];

    if (!leaderboardName) {
      return message.reply('Usage: !deleteLeaderboard <name>');
    }

    const leaderboardService = container.leaderboardService;

    try {
      const server = await container.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );

      const leaderboard = await leaderboardService.getLeaderboard(
        server.id,
        leaderboardName
      );

      if (!leaderboard) {
        return message.reply(`Leaderboard "${leaderboardName}" not found.`);
      }

      await leaderboardService.deleteLeaderboard(leaderboard.id);
      message.reply(`Leaderboard "${leaderboardName}" has been deleted.`);
    } catch (error) {
      console.error('Error deleting leaderboard:', error);
      message.reply('An error occurred while deleting the leaderboard.');
    }
  }
});

// Reset a leaderboard
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!resetPoints')) {
    const args = message.content.split(' ');
    const leaderboardName = args[1];

    if (!leaderboardName) {
      return message.reply('Usage: !resetPoints <leaderboard_name>');
    }

    const leaderboardService = container.leaderboardService;
    const memberService = container.memberService;

    try {
      const server = await container.serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );

      const leaderboard = await leaderboardService.getLeaderboard(
        server.id,
        leaderboardName
      );

      if (!leaderboard) {
        return message.reply(`Leaderboard "${leaderboardName}" not found.`);
      }

      await memberService.resetPoints(leaderboard.id);
      message.reply(`All points in "${leaderboardName}" have been reset to 0.`);
    } catch (error) {
      console.error('Error resetting points:', error);
      message.reply('An error occurred while resetting points.');
    }
  }
});

// Modify points for a member
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!modifyPoints')) {
    const args = message.content.split(' ');
    const leaderboardName = args[1];
    const mentionedUser = args[2];
    const discordId = mentionedUser?.replace(/[<@!>]/g, '');
    const points = parseInt(args[3], 10);
    const description = args.slice(4).join(' ');

    if (!leaderboardName || !discordId || isNaN(points)) {
      return message.reply(
        'Usage: !modifyPoints <leaderboard_name> @member <points> <description>'
      );
    }

    const serverService = container.serverService;
    const leaderboardService = container.leaderboardService;
    const memberService = container.memberService;

    try {
      const server = await serverService.getOrCreateServer(
        message.guildId!,
        message.guild!.name
      );
      const leaderboard = await leaderboardService.getLeaderboard(
        server.id,
        leaderboardName
      );

      if (!leaderboard) {
        return message.reply(`Leaderboard "${leaderboardName}" not found.`);
      }

      const updatedMember = await memberService.modifyPoints(
        leaderboard.id,
        discordId,
        points,
        description
      );

      message.reply(
        `Member <@${discordId}> now has ${updatedMember.points} points in leaderboard "${leaderboardName}".`
      );
    } catch (error) {
      console.error('Error modifying points:', error);
      message.reply('An error occurred while modifying points.');
    }
  }
});

// Login bot's token
client.login(process.env.DISCORD_TOKEN);
