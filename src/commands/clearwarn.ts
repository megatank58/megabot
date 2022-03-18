import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	PermissionsBitField,
} from 'discord.js';
import { prisma } from '../util';

export const name = 'clearwarn';
export const description = 'Clear the warnings of member';
export const options = [
	{
		name: 'member',
		description: 'The warnings of the member to clear',
		type: ApplicationCommandOptionType.User,
		required: true,
	},
];
export async function run(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;

	const member = interaction.options.getMember('member')!;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
		return interaction.editReply('You do not have the `KICK_MEMBERS` permission.');
	}

	const warnings = await prisma.warnings.findFirst({
		where: {
			guild: interaction.guildId!,
			member: member.id,
		},
	});

	if (!warnings) return interaction.editReply('No warning found for the user.');

	await prisma.warnings.delete({
		where: {
			id: warnings.id,
		},
	});

	interaction.editReply(`Deleted all warnings for ${member}.`);
}
