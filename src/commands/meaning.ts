import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { trim } from '../util';

export default {
	name: 'meaning',
	description: 'Sends the meaning of a given word',
	ephemeral: true,
	options: [
		{
			name: 'word',
			description: 'The word to find the meaning for',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	async execute(interaction: ChatInputCommandInteraction) {
		const word = interaction.options.getString('word');

		if (!word) return;

		const query = new URLSearchParams({ term: word });

		const { list } = await (await fetch(`https://api.urbandictionary.com/v0/define?${query}`)).json() as any;

		const [answer] = list;

		if (!answer) { return interaction.editReply('No meaning found!'); }

		const embed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{
					name: 'Rating',
					value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
				},
			);

		interaction.editReply({ embeds: [embed] });
	},
} as any;