import { CommandInteraction, ApplicationCommandData, GuildMember } from 'discord.js';
import fetch from 'node-fetch';

export default {
	name: 'delwarn',
	description: 'Delete the warnings of member',
	options: [
		{
			name: 'member',
			description: 'The warnings of the member to delete',
			type: 6,
			required: true,
		},
		{
			name: 'warn',
			description: 'The ID of the warn',
			type: 3,
			required: true,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const member = interaction.options.getMember('member')!;
		const id = interaction.options.getString('warn')!;
		if (!(member instanceof GuildMember)) return;

		const body = {
			secret: process.env.SECRET,
			db: 'warns',
			key: member.id,
			data: id,
		};

		await fetch('https://database.bloxdatabase.repl.co/pop', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});

		interaction.editReply(`Deleted \`${id}\` warning for ${member}`);
	},
} as ApplicationCommandData;
