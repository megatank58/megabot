import { CommandInteraction, ApplicationCommandData, GuildMember, Constants } from 'discord.js';
import { v4 as uuid } from 'uuid';
import fetch from 'node-fetch';

export default {
	name: 'warn',
	description: 'Warn a member',
	options: [
		{
			name: 'member',
			description: 'The member to warn',
			type: Constants.ApplicationCommandOptionTypes.USER,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason for warn',
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
	],
	default_permission: false,
	execute(interaction: CommandInteraction) {
		const member = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') ?? '';

		if (!member || !(member instanceof GuildMember)) return;

		const id = uuid();
		const body = {
			secret: process.env.SECRET,
			db: 'warns',
			key: member.id,
			data: { id, reason, moderator: interaction.user.tag },
		};

		fetch('https://database.bloxdatabase.repl.co/push', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});
		interaction.editReply({
			embeds: [
				{
					description: `:white_check_mark: ***${member} was warned.*** ${
						reason ? `**|| ${reason}**` : ''
					}`,
					color: 'GREEN',
				},
			],
		});
	},
} as ApplicationCommandData;
