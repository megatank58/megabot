import { ApplicationCommandData, CommandInteraction, Constants } from 'discord.js';
import fetch from 'node-fetch';

export default {
	name: 'get',
	description: 'Get the data from database',
	options: [
		{
			name: 'database',
			description: 'The database to get value from',
			type: Constants.ApplicationCommandOptionTypes['STRING'],
			required: true,
		},
		{
			name: 'query',
			description: 'The query to get value for',
			type: Constants.ApplicationCommandOptionTypes['STRING'],
			required: true,
		},
	],
	async execute(interaction: CommandInteraction, args: any) {
		const body = { secret: '123456', db: args.database, key: args.query };

		const res = await fetch('https://database.bloxdatabase.repl.co/get', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
		interaction.editReply(await res.text());
	},
} as ApplicationCommandData;
