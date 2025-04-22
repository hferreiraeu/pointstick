import { Command } from '../types/Command';
import { PREFIX } from '../config';
import { Message, EmbedBuilder } from 'discord.js';

const helpCommand: Command = {
  name: 'help',
  description: 'List all commands or info about a specific command',
  usage: `${PREFIX}help [command]`,
  execute: async (message: Message, args: string[]): Promise<void> => {
    const commands = (message.client as any).commands as Map<string, Command>;

    // No args: list every command
    if (!args.length) {
      const embed = new EmbedBuilder()
        .setTitle('Help - All commands')
        .setDescription(
          Array.from(commands.values())
            .map((cmd) => `**${cmd.name}**: ${cmd.description}`)
            .join('\n')
        )
        .setTimestamp();
      await message.reply({ embeds: [embed] });
      return;
    }

    // One arg: show detailed usage for that command
    const name = args[0].toLowerCase();
    const command = commands.get(name);
    if (!command) {
      await message.reply(`❌ Command "${name}" not found.`);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Help - ${command.name}`)
      .addFields(
        { name: 'Description', value: command.description },
        { name: 'Usage', value: command.usage ?? 'No usage available.' }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};

export default helpCommand;
