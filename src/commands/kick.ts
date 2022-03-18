import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from 'discord.js';
import { logger } from '../util';

export const name = 'kick';
export const description = 'Kick a member';
export const options = [
	{
		name: 'member',
		description: 'The member to kick',
		type: ApplicationCommandOptionType.User,
		required: true,
	},
	{
		name: 'reason',
		description: 'The reason for kick',
		type: ApplicationCommandOptionType.String,
	},
];
export function run(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;

	const member = interaction.options.getMember('member')!;
	const reason = interaction.options.getString('reason')!;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
		return interaction.editReply('You do not have the `KICK_MEMBERS` permission.');
	}

	if (
		interaction.member.roles.highest.position < member.roles.highest.position ||
		interaction.guild.ownerId === interaction.member.id
	) {
		return interaction.editReply('The highest role of the person is above your highest role');
	}

	if (!member.kickable) {
		return interaction.editReply('The role of the bot is below the person!');
	}

	const embed = new EmbedBuilder()
		.setDescription(
			`You were kicked from **${interaction.guild?.name}** ${reason ? `**|| ${reason}**` : ''}`,
		)
		.setColor('Red');

	member.user
		.send({
			embeds: [embed],
		})
		.catch();

	member.kick(reason).catch((e) => logger.error(e));

	embed
		.setDescription(
			`:white_check_mark: ***${member} was kicked.*** ${reason ? `**|| ${reason}**` : ''}`,
		)
		.setColor('Green');

	interaction.editReply({
		embeds: [embed],
	});
}
