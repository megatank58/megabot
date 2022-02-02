import type { CommandInteraction } from 'discord.js';

export default {
	name: 'ping',
	description: 'Ping pong!',
	execute(interaction: CommandInteraction) {
		interaction.editReply(`${Date.now() - interaction.createdTimestamp}ms`);
	},
};
