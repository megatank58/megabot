import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from 'discord.js';
import { logger } from '../util';

export const name = 'ban';
export const description = 'bans a member';
export const options = [
	{
		name: 'member',
		description: 'The member to ban',
		type: ApplicationCommandOptionType.User,
		required: true,
	},
	{
		name: 'reason',
		description: 'The reason for ban',
		type: ApplicationCommandOptionType.String,
	},
];
export function run(interaction: ChatInputCommandInteraction) {
	if (!interaction.inCachedGuild()) return;

	const member = interaction.options.getMember('member')!;
	const reason = interaction.options.getString('reason')!;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.BanMembers)) {
		return interaction.editReply('You do not have the `BAN_MEMBERS` permission.');
	}

	if (
		interaction.member.roles.highest.position < member.roles.highest.position ||
		interaction.guild.ownerId === interaction.member.id
	) {
		return interaction.editReply('The highest role of the person is above your highest role');
	}

	if (!member.bannable) {
		return interaction.editReply('The role of the bot is below the person!');
	}

	let embed = new EmbedBuilder()
		.setDescription(
			`You were banned in **${interaction.guild?.name}** ${reason ? `**|| ${reason}**` : ''}`,
		);

	member.user
		.send({
			embeds: [embed],
		})
		.catch();

	member.ban({ reason: reason }).catch((e) => logger.info(e));

	embed = new EmbedBuilder()
		.setDescription(
			`:white_check_mark: ${member} was banned. ${reason ? `**|| ${reason}**` : ''}`,
		);

	interaction.editReply({
		embeds: [embed],
	});
}
