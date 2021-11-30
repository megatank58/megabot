import type { CommandInteraction, ApplicationCommandData } from 'discord.js';

export default {
	name: 'waifu',
	description: 'Get your waifu',
	execute(interaction: CommandInteraction) {
		const url = `https://thiswaifudoesnotexist.net/v2/example-${Math.floor(
			Math.random() * 1_00_000,
		)}.jpg`;
		interaction.editReply({
			embeds: [
				{
					title: '>',
					color: 'AQUA',
					image: { url },
					footer: { text: 'Powered by https://thiswaifudoesnotexist.net' },
					url,
				},
			],
		});
	},
} as ApplicationCommandData;
