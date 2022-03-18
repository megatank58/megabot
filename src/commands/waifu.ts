import { EmbedBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';

export const name = 'waifu';
export const description = 'Get your waifu';
export function run(interaction: CommandInteraction) {
	const url = `https://thiswaifudoesnotexist.net/v2/example-${Math.floor(
		Math.random() * 1_00_000,
	)}.jpg`;

	const embed = new EmbedBuilder()
		.setTitle('>')
		.setImage(url)
		.setFooter({ text: 'Powered by https://thiswaifudoesnotexist.net' })
		.setURL(url);

	interaction.editReply({
		embeds: [embed],
	});
}