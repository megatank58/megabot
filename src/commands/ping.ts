import { CommandInteraction, ApplicationCommandData } from 'discord.js';

export default {
	name: 'ping',
	description: 'Check the ping of the bot',
	isGlobal: true,
	execute(interaction: CommandInteraction) {
		interaction.editReply('Pong!');
	},
} as ApplicationCommandData;
