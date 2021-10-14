import { ApplicationCommandData, CommandInteraction, Constants } from 'discord.js';
import fetch from 'node-fetch';

export default {
	name: 'set',
	description: 'Set the data in database',
	options: [
		{
			name: 'database',
			description: 'The database to set value for',
			type: Constants.ApplicationCommandOptionTypes['STRING'],
			required: true,
		},
		{
			name: 'query',
			description: 'The query to set value for',
			type: Constants.ApplicationCommandOptionTypes['STRING'],
			required: true,
		},
		{
			name: 'value',
			description: 'The value to set',
			type: Constants.ApplicationCommandOptionTypes['STRING'],
			required: true,
		},
	],
	async execute(interaction: CommandInteraction, args: any) {
		const body = { secret: '123456', db: args.database, key: args.query, data: args.value };

		fetch('https://database.bloxdatabase.repl.co/set', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
		interaction.editReply(`${args.query} set to ${args.value} in ${args.database}`);
	},
} as ApplicationCommandData;
