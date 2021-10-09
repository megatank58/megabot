import { CommandInteraction } from 'discord.js';

export default {
	name: 'ping',
	execute(interaction: CommandInteraction) {
		interaction.reply('Pong!');
	},
};
