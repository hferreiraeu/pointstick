import { Client, GatewayIntentBits } from 'discord.js';
import { Container } from './services/Container';

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const db = Container.getInstance().getDatabaseService();

// When the bot is ready
client.once('ready', () => {
    console.log('Bot is online!');
});

// Respond to messages
client.on('messageCreate', (message) => {
    if (message.content === '!hello') {
        message.reply('Hello, I am Point Stick!');
    }
});

// Create Leaderboard
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!createLeaderboard')) {
      const args = message.content.split(' ');
      const leaderboardName = args[1];
  
      if (!leaderboardName) {
        return message.reply('Please provide a leaderboard name.');
      }
  
      const server = await db.getOrCreateServer(message.guildId!, message.guild!.name);
      await db.createLeaderboard(server.id, leaderboardName);
  
      message.reply(`Leaderboard "${leaderboardName}" created!`);
    }
  });


// Login bot's token
import { config } from 'dotenv';
config();

client.login(process.env.DISCORD_TOKEN);