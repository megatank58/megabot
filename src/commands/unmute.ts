import { CommandInteraction, ApplicationCommandData, GuildMember, Constants } from 'discord.js';
import fetch from 'node-fetch';

export default {
	name: 'unmute',
	description: 'Unmute a member',
	options: [
		{
			name: 'member',
			description: 'The member to unmute',
			type: Constants.ApplicationCommandOptionTypes.USER,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason for unmute',
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const member = interaction.options.getMember('member')!;
		const reason = interaction.options.getString('reason')!;

		const body = {
			secret: process.env.SECRET,
			db: 'muteroles',
			key: interaction.guild?.id,
		};

		const data = await (
			await fetch('https://database.bloxdatabase.repl.co/get', {
				method: 'POST',
				body: JSON.stringify(body),
				headers: { 'Content-Type': 'application/json' },
			})
		).json();

		if (!member || !(member instanceof GuildMember)) return;

		member.roles.remove(data.role);

		clearTimeout(
			interaction.client.timeouts.find(
				(timeout) => timeout.guildId === interaction.guildId! && timeout.memberId === member.id,
			)?.value,
		);

		interaction.editReply({
			embeds: [
				{
					description: `:white_check_mark: ***${member} was unmuted.*** ${
						reason ? `**|| ${reason}**` : ''
					}`,
					color: 'GREEN',
				},
			],
		});
	},
} as ApplicationCommandData;
