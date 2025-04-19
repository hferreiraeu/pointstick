import { Client, GatewayIntentBits, Message, PermissionsBitField } from 'discord.js';
import { DISCORD_TOKEN, PREFIX } from './config';
import { Command } from './types/Command';
import { Container } from './services/Container';

import helloCommand from './commands/hello';
import createLeaderboardCommand from './commands/createLeaderboard';
import addMemberCommand from './commands/addMember';
import modifyPointsCommand from './commands/modifyPoints';
import viewLeaderboardCommand from './commands/viewLeaderboard';
import listLeaderboardsCommand from './commands/listLeaderboards';
import deleteLeaderboardCommand from './commands/deleteLeaderboard';
import resetPointsCommand from './commands/resetPoints';
import grantAdminCommand from './commands/grantAdmin';
import revokeAdminCommand from './commands/revokeAdmin';

const commands: Map<string, Command> = new Map([
  [helloCommand.name, helloCommand],
  [createLeaderboardCommand.name, createLeaderboardCommand],
  [addMemberCommand.name, addMemberCommand],
  [modifyPointsCommand.name, modifyPointsCommand],
  [viewLeaderboardCommand.name, viewLeaderboardCommand],
  [listLeaderboardsCommand.name, listLeaderboardsCommand],
  [deleteLeaderboardCommand.name, deleteLeaderboardCommand],
  [resetPointsCommand.name, resetPointsCommand],
  [grantAdminCommand.name, grantAdminCommand],
  [revokeAdminCommand.name, revokeAdminCommand],
]);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => console.log('✅ Bot is online!'));

client.on('messageCreate', async (message: Message) => {
  if (!message.guild || message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift()!.toLowerCase();
  const command = commands.get(commandName);
  if (!command) return;

  const container = Container.getInstance();

  // Permission check
  if (command.requireAdmin) {
    // Ensure server record exists
    const server = await container.serverService.getOrCreateServer(
      message.guildId!,
      message.guild!.name
    );
    // Check Discord admin bit
    const guildMember = await message.guild.members.fetch(message.author.id);
    const isDiscordAdmin = guildMember.permissions.has(PermissionsBitField.Flags.Administrator);
    // Check custom admin table
    const isCustomAdmin = await container.adminPermissionService.isAdmin(
      server.id,
      message.author.id
    );
    if (!isDiscordAdmin && !isCustomAdmin) {
      await message.reply("❌ You don't have permission to use this command.");
      return;
    }
  }

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error('Command execution error:', err);
    await message.reply('⚠️ An unexpected error occurred.');
  }
});

client.login(DISCORD_TOKEN);
