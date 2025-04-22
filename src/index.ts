import { Client, GatewayIntentBits, Message, PermissionsBitField } from 'discord.js';
import { DISCORD_TOKEN, PREFIX } from './config';
import { Command } from './types/Command';
import { Container } from './services/Container';
import * as fs from 'fs';
import * as path from 'path';

const commands: Map<string, Command> = new Map();
const commandsPath = path.join(__dirname, 'commands');

// Detect whether we're running TS (in your VS debugger via ts-node) or JS (compiled)
const isTsNode = __filename.endsWith('.ts');
const extension = isTsNode ? '.ts' : '.js';

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(extension));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  try {
    const commandModule = require(filePath);
    // support both `export default` and `module.exports`
    const command: Command = commandModule.default ?? commandModule;
    if (!command || typeof command.name !== 'string') {
      console.warn(`[WARN] skipping "${file}" – no valid Command exported.`);
      continue;
    }
    commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
  } catch (err) {
    console.error(`[ERROR] loading "${file}":`, err);
  }
}

// create and wire up the client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// make it available for our help command
;(client as any).commands = commands;

client.once('ready', () => console.log('✅ Bot is online!'));

client.on('messageCreate', async (message: Message) => {
  if (!message.guild || message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const name = args.shift()!.toLowerCase();
  const command = commands.get(name);
  if (!command) return;

  const container = Container.getInstance();

  if (command.requireAdmin) {
    // Ensure server record exists
    const server = await container.serverService.getOrCreateServer(
      message.guildId!,
      message.guild!.name
    );
    // Check Discord admin bit
    const guildMember = await message.guild.members.fetch(message.author.id);
    const isDiscordAdmin = guildMember.permissions.has(
      PermissionsBitField.Flags.Administrator
    );
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
