import { Interaction } from 'discord.js';

export default {
	name: 'interactionCreate',
	async execute(interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client._commands.get(interaction.commandName);

		if (!command) return;

		await interaction.deferReply({ ephemeral: command.ephemeral || false });

		try {
			command?.execute(interaction);
		} catch (err) {
			console.error(err);
		} finally {
			interaction.client.emit('debug', '[WS => CommandInteraction] Replied successfully');
		}
	},
};
