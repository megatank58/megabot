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
export function run(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;

	const member = interaction.options.getMember('member')!;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
		return interaction.editReply('You do not have the `KICK_MEMBERS` permission.');
	}

	prisma.warnings.delete({
		where: {
			guild: interaction.guildId!,
			member: member.id,
		},
	});

	interaction.editReply(`Deleted all warnings for ${member}`);
}
