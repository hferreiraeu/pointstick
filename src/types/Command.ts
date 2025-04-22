import { Message } from 'discord.js';

export interface Command {

  name: string;

  description: string;

  usage?: string;  

  requireAdmin?: boolean;
  
  execute: (message: Message, args: string[]) => Promise<void>;
}
