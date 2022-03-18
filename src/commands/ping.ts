import type { CommandInteraction } from 'discord.js';

export const name = 'ping';
export const description = 'Ping pong!';
export function run(interaction: CommandInteraction) {
	interaction.editReply(`${Date.now() - interaction.createdTimestamp}ms`);
}
