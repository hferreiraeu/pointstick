import { Message } from 'discord.js';

export interface Command {

  name: string;

  description: string;

  requireAdmin?: boolean;
  
  execute: (message: Message, args: string[]) => Promise<void>;
}
