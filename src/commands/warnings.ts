import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from 'discord.js';
import { prisma } from '../util';

export const name = 'warnings';
export const description = 'See the warnings of member';
export const options = [
	{
		name: 'member',
		description: 'The warnings of the member to see',
		type: ApplicationCommandOptionType.User,
		required: true,
	},
];
export async function run(interaction: ChatInputCommandInteraction) {
	const embed = new EmbedBuilder();

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

	if (!warnings?.warns || warnings?.warns.length === 0) {
		embed.setDescription('No warnings.');

		return interaction.editReply({
			embeds: [embed],
		});
	}

	for (const warn of warnings.warns) {
		if (embed.toJSON().fields?.length || 0 < 24) {
			embed.addFields({
				name: `ID: ${warn.id} | Moderator: ${warn.moderator}`,
				value: `Reason: ${warn.reason || 'None'}`,
			});
		}
	}

	embed.setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() });

	interaction.editReply({
		embeds: [embed],
	});
}
