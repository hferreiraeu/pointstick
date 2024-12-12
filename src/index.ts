import { Client, GatewayIntentBits } from 'discord.js';

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

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

// Login bot's token
import { config } from 'dotenv';
config();

client.login(process.env.DISCORD_TOKEN);