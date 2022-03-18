import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from 'discord.js';

export const name = 'unmute';
export const description = 'Unmute a member';
export const options = [
	{
		name: 'member',
		description: 'The member to unmute',
		type: ApplicationCommandOptionType.User,
		required: true,
	},
	{
		name: 'reason',
		description: 'The reason for unmute',
		type: ApplicationCommandOptionType.String,
	},
];
export function run(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;

	const member = interaction.options.getMember('member')!;
	const reason = interaction.options.getString('reason')!;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ModerateMembers)) {
		return interaction.editReply('You do not have the `MODERATE_MEMBERS` permission.');
	}

	interaction.member.timeout(null, reason);

	const embed = new EmbedBuilder()
		.setDescription(
			`:white_check_mark: ***${member} was unmuted.*** ${reason ? `**|| ${reason}**` : ''}`,
		);

	interaction.editReply({
		embeds: [embed],
	});
}
