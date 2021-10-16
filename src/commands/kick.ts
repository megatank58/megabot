import { CommandInteraction, ApplicationCommandData, GuildMember } from 'discord.js';

export default {
	name: 'kick',
	description: 'Kick a member',
	options: [
		{
			name: 'member',
			description: 'The member to kick',
			type: 6,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason for kick',
			type: 3,
		},
	],
	async execute(interaction: CommandInteraction) {
		const member = interaction.options.getMember('member')!;
		const reason = interaction.options.getString('reason')!;

		if (!member || !(member instanceof GuildMember)) return;

		member.user.send({
			embeds: [
				{
					description: `You were kicked in **${interaction.guild?.name}** ${
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
