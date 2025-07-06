import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Message } from 'discord.js';

const helloCommand: Command = {
  name: 'hello',
  description: 'Replies with a greeting',
  usage: `${PREFIX}hello`,
  execute: async (message: Message, args: string[]): Promise<void> => {
    await message.reply('Hello, I am Point Stick! :)');
  },
};

export default helloCommand;
