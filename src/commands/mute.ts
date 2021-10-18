import { CommandInteraction, ApplicationCommandData, GuildMember, Constants } from 'discord.js';
import fetch from 'node-fetch';

export default {
	name: 'mute',
	description: 'Mute a member',
	options: [
		{
			name: 'member',
			description: 'The member to mute',
			type: Constants.ApplicationCommandOptionTypes.USER,
			required: true,
		},
		{
			name: 'time',
			description: 'The time for mute',
			type: Constants.ApplicationCommandOptionTypes.INTEGER,
			required: true,
			choices: [
				{
					name: '1 hours',
					value: 3_600_000,
				},
				{
					name: '3 hours',
					value: 10_800_000,
				},
				{
					name: '6 hours',
					value: 21_600_000,
				},
				{
					name: '12 hours',
					value: 43_200_000,
				},
				{
					name: '1 day',
					value: 86_400_000,
				},
			],
		},
		{
			name: 'reason',
			description: 'The reason for mute',
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const member = interaction.options.getMember('member')!;
		const reason = interaction.options.getString('reason');
		const time = interaction.options.getInteger('time')!;

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

		member.roles.add(data.role);

		const timeout = setTimeout(async () => {
			if ((await member.fetch()).roles.cache.has(data.role)) {
				member.roles.remove(data.role);
			}
		}, time);

		interaction.client.timeouts.push({
			guildId: interaction.guildId!,
			memberId: member.id,
			value: timeout,
		});

		interaction.editReply({
			embeds: [
				{
					description: `:white_check_mark: ***${member} was muted${time ? ` for ${new Date(time).getHours()}hrs` : ''}.*** ${
						reason ? `**|| ${reason}**` : ''
					}`,
					color: 'GREEN',
				},
			],
		});
	},
} as ApplicationCommandData;
