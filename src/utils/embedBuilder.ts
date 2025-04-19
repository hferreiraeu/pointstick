import { EmbedBuilder, APIEmbedField } from 'discord.js';

export const buildLeaderboardEmbed = (
  title: string,
  entries: { name: string; value: string; inline?: boolean }[]
) => {
  return new EmbedBuilder()
    .setTitle(title)
    .addFields(entries as APIEmbedField[])
    .setTimestamp();
};
