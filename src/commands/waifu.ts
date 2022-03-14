import { EmbedBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';

export default {
	name: 'waifu',
	description: 'Get your waifu',
	execute(interaction: CommandInteraction) {
		const url = `https://thiswaifudoesnotexist.net/v2/example-${Math.floor(
			Math.random() * 1_00_000,
		)}.jpg`;

		const embed = new EmbedBuilder()
			.setTitle('>')
			.setColor('Aqua')
			.setImage(url)
			.setFooter({ text: 'Powered by https://thiswaifudoesnotexist.net' })
			.setURL(url);

		interaction.editReply({
			embeds: [embed],
		});
	},
};
