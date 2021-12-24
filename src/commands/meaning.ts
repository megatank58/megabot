import { Command } from '@megabot/command';
import { MessageEmbed, Constants } from 'discord.js';
import fetch from 'node-fetch';

const trim = (str: string, max: number) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

export default new Command({
	name: 'meaning',
	description: 'Sends the meaning of a given word',
	ephemeral: true,
	options: [
		{
			name: 'word',
			description: 'The word to find the meaning for',
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		},
	],
	async execute(interaction) {
		const word = interaction.options.getString('word');

		if (!word) return;

		const query = new URLSearchParams({ term: word });

		const { list } = await (await fetch(`https://api.urbandictionary.com/v0/define?${query}`)).json() as any;

		const [answer] = list;

		if (!answer) { return interaction.editReply('No meaning found!'); }

		const embed = new MessageEmbed()
			.setColor('#EFFF00')
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
});