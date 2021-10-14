import { CommandInteraction } from 'discord.js';

export default {
	name: 'ping',
	description: 'Check the ping of the bot',
	execute(interaction: CommandInteraction, args: any) {
		interaction.editReply('Pong!');
	},
};
