import type { Interaction } from 'discord.js';
import { logger } from '@megabot/logger'

export default {
	name: 'interactionCreate',
	async execute(interaction: Interaction) {
		if (interaction.isCommand()) {
			const command = interaction.client._commands.get(interaction.commandName);

			if (!command) return;
			
			await interaction.deferReply({ ephemeral: command.ephemeral || false });

			try {
				command?.execute(interaction);
			} catch (err) {
				console.error(err);
			} finally {
				logger.debug('CommandInteraction: Replied successfully');
			}
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client._commands.get(interaction.commandName);

			if (!command) return;

			try {
				command?.complete(interaction);
			} catch (err) {
				console.error(err);
			} finally {
				logger.debug('AutocompleteInteraction: Responded successfully');
			}
		}
	},
};
