import { CommandInteraction, ApplicationCommandData } from 'discord.js';

export default {
	name: 'waifu',
	description: 'Get your waifu',
	isGlobal: true,
	execute(interaction: CommandInteraction) {
		const url = `https://thiswaifudoesnotexist.net/example-${Math.floor(
			Math.random() * 100000,
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
