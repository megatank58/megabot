import { type Interaction } from 'discord.js';

export const name = 'interactionCreate';
export async function run(interaction: Interaction) {
	if (interaction.isCommand()) {
		const command = interaction.client._commands.get(interaction.commandName);

		if (!command) return;

		await interaction.deferReply({ ephemeral: command.ephemeral });

		try {
			if (!command.run) return;

			command.run(interaction);
		} catch (err) {
			console.error(err);
		}
	} else if (interaction.isAutocomplete()) {
		const command = interaction.client._commands.get(interaction.commandName);

		if (!command) return;

		try {
			if (!command.complete) return;

			command?.complete(interaction);
		} catch (err) {
			console.error(err);
		}
	} else if (interaction.isContextMenuCommand()) {
		const command = interaction.client._commands.get(interaction.commandName);

		if (!command) return;

		await interaction.deferReply({ ephemeral: command.ephemeral });

		try {
			if (!command.menu) return;
			
			command?.menu(interaction);
		} catch (err) {
			console.error(err);
		}
	}
}
