import { CommandInteraction } from 'discord.js';

export default {
	name: 'help',
	description: 'Get a list of all commands',
	execute(interaction: CommandInteraction) {
		await interaction.reply('WIP');
	},
};
