import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from 'discord.js';

export const name = 'mute';
export const description = 'Mute a member';
export const options = [
	{
		name: 'member',
		description: 'The member to mute',
		type: ApplicationCommandOptionType.User,
		required: true,
	},
	{
		name: 'time',
		description: 'The time for mute',
		type: ApplicationCommandOptionType.Integer,
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
		type: ApplicationCommandOptionType.String,
	},
];
export function run(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;

	const member = interaction.options.getMember('member')!;
	const reason = interaction.options.getString('reason')!;
	const time = interaction.options.getInteger('time')!;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ModerateMembers)) {
		return interaction.editReply('You do not have the `MODERATE_MEMBERS` permission.');
	}

	interaction.member.timeout(time, reason);

	const embed = new EmbedBuilder()
		.setDescription(
			`:white_check_mark: ***${member} was muted${
				time ? ` for ${new Date(time).getHours()}hrs` : ''
			}.*** ${reason ? `**|| ${reason}**` : ''}`,
		)
		.setColor('Green');

	interaction.editReply({
		embeds: [embed],
	});
}
