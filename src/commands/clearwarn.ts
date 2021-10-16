import { CommandInteraction, ApplicationCommandData, GuildMember } from 'discord.js';
import fetch from 'node-fetch';

export default {
	name: 'clearwarn',
	description: 'Clear the warnings of member',
	options: [
		{
			name: 'member',
			description: 'The warnings of the member to clear',
			type: 6,
			required: true,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const member = interaction.options.getMember('member');
		if (!member || !(member instanceof GuildMember)) return;

		const body = {
			secret: process.env.SECRET,
			db: 'warns',
			key: member.id,
		};

		await fetch('https://database.bloxdatabase.repl.co/delete', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});

		interaction.editReply(`Deleted all warnings for ${member}`);
	},
} as ApplicationCommandData;
