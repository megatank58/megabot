import { prisma } from '../util';
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from 'discord.js';
import { v4 } from 'uuid';

export const name = 'warn';
export const description = 'Warn a member';
export const options = [
	{
		name: 'member',
		description: 'The member to warn',
		type: ApplicationCommandOptionType.User,
		required: true,
	},
	{
		name: 'reason',
		description: 'The reason for warn',
		type: ApplicationCommandOptionType.String,
	},
];
export async function run(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;

	const member = interaction.options.getMember('member')!;
	const reason = interaction.options.getString('reason')!;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
		return interaction.editReply('You do not have the `KICK_MEMBERS` permission.');
	}

	const id = v4();

	const warnings = await prisma.warnings.findUnique({
		where: {
			guild: interaction.guildId!,
			member: member.id,
		},
	});

	const warn = {
		id,
		moderator: interaction.member.id,
		reason,
	};

	if (warnings) {
		warnings.warns.push(warn);
		await prisma.warnings.update({
			where: {
				id: warnings.id,
				guild: interaction.guildId!,
				member: interaction.member?.id,
			},
			data: {
				warns: warnings.warns,
			},
		});
	} else if (!warnings) {
		await prisma.warnings.create({
			data: {
				guild: interaction.guildId,
				member: member.id,
				warns: [warn],
			},
		});
	}

	const embed = new EmbedBuilder()
		.setDescription(
			`:white_check_mark: ***${member} was warned.*** ${reason ? `**|| ${reason}**` : ''}`,
		)
		.setColor('Green');

	interaction.editReply({
		embeds: [embed],
	});
}
