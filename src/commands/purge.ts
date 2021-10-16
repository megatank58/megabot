import { CommandInteraction, ApplicationCommandData, TextChannel } from 'discord.js';

export default {
	name: 'purge',
	description: 'Clears messages in the chat',
	options: [
		{
			name: 'messages',
			description: 'The number of messages to clear',
			type: 4,
			required: true,
		},
	],
	async execute(interaction: CommandInteraction) {
		const channel = interaction.channel;
		const number = interaction.options.getInteger('messages')!;

		if (!channel || !(channel instanceof TextChannel)) return;

		await channel.bulkDelete(number + 1, true);

		const message = await channel.send(`Deleted ${number} messages!`);
		setTimeout(() => message.delete(), 3000);
	},
} as ApplicationCommandData;
