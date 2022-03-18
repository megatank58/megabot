import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	PermissionsBitField,
} from 'discord.js';
import { prisma } from '../util';

export const name = 'delwarn';
export const description = 'Delete the warnings of member';
export const options = [
	{
		name: 'member',
		description: 'The warnings of the member to delete',
		type: ApplicationCommandOptionType.User,
		required: true,
	},
	{
		name: 'warn',
		description: 'The ID of the warn',
		type: ApplicationCommandOptionType.String,
		required: true,
	},
];
export async function run(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
		return interaction.editReply('You do not have the `KICK_MEMBERS` permission.');
	}

	const member = interaction.options.getMember('member')!;
	const id = interaction.options.getString('warn')!;

	const warnings = await prisma.warnings.findFirst({
		where: {
			guild: interaction.guildId!,
			member: member.id,
		},
	});

	if (!warnings) return interaction.editReply('No warning found for the user.');

	warnings.warns = warnings?.warns.filter((warn) => warn.id !== id);

	await prisma.warnings.update({
		data: {
			warns: warnings.warns,
		},
		where: {
			id: warnings.id,
		},
	});

	interaction.editReply(`Deleted \`${id}\` warning for ${member}.`);
}
