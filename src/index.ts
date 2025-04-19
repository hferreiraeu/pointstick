import { Client, GatewayIntentBits, Message } from 'discord.js';
import { DISCORD_TOKEN, PREFIX } from './config';
import { Command } from './types/Command';

import helloCommand from './commands/hello';
import createLeaderboardCommand from './commands/createLeaderboard';
import addMemberCommand from './commands/addMember';
import modifyPointsCommand from './commands/modifyPoints';
import viewLeaderboardCommand from './commands/viewLeaderboard';
import listLeaderboardsCommand from './commands/listLeaderboards';
import deleteLeaderboardCommand from './commands/deleteLeaderboard';
import resetPointsCommand from './commands/resetPoints';

const commands: Map<string, Command> = new Map([
  [helloCommand.name, helloCommand],
  [createLeaderboardCommand.name, createLeaderboardCommand],
  [addMemberCommand.name, addMemberCommand],
  [modifyPointsCommand.name, modifyPointsCommand],
  [viewLeaderboardCommand.name, viewLeaderboardCommand],
  [listLeaderboardsCommand.name, listLeaderboardsCommand],
  [deleteLeaderboardCommand.name, deleteLeaderboardCommand],
  [resetPointsCommand.name, resetPointsCommand],
]);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('✅ Bot is online!');
});

client.on('messageCreate', async (message: Message) => {
  if (!message.guild || message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift()!.toLowerCase();

  const command = commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error('Command execution error:', error);
    message.reply('An unexpected error occurred.');
  }
});

client.login(DISCORD_TOKEN);
