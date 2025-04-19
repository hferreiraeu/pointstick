import { Command } from '../types/Command';

const helloCommand: Command = {
  name: 'hello',
  description: 'Replies with a greeting',
  execute: async (message) => {
    await message.reply('Hello, I am Point Stick!');
  },
};

export default helloCommand;
