import dotenv from 'dotenv';
dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
export const PREFIX = process.env.PREFIX || '!';