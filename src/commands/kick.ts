import { CommandInteraction, ApplicationCommandData, GuildMember, Constants } from 'discord.js';

export default {
	name: 'kick',
	description: 'Kick a member',
	options: [
		{
			name: 'member',
			description: 'The member to kick',
			type: Constants.ApplicationCommandOptionTypes.USER,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason for kick',
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const member = interaction.options.getMember('member')!;
		const reason = interaction.options.getString('reason')!;

		if (!member || !(member instanceof GuildMember)) return;

		member.user.send({
			embeds: [
				{
					description: `You were kicked from **${interaction.guild?.name}** ${
						reason ? `**|| ${reason}**` : ''
					}`,
					color: 'RED',
				},
			],
		});

		member.kick(reason);

		interaction.editReply({
			embeds: [
				{
					description: `:white_check_mark: ***${member} was kicked.*** ${
						reason ? `**|| ${reason}**` : ''
					}`,
					color: 'GREEN',
				},
			],
		});
	},
} as ApplicationCommandData;
