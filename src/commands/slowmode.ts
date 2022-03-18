import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionsBitField, TextChannel } from 'discord.js';
import { logger } from '../util';

export const name = 'slowmode';
export const description = 'Set the slowmode in a channel';
export const options = [
	{
		name: 'channel',
		description: 'The channel to set slowmode for',
		type: ApplicationCommandOptionType.Channel,
		required: true,
		channel_types: [ChannelType.GuildText],
	},
	{
		name: 'slowmode',
		description: 'The slowmode to set',
		type: ApplicationCommandOptionType.Integer,
		required: true,
	},
];
export function run(interaction: ChatInputCommandInteraction) {
	const channel = interaction.options.getChannel('channel', true);
	const slowmode = interaction.options.getInteger('slowmode', true);

	if (!interaction.inCachedGuild() || !(channel instanceof TextChannel)) return;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageMessages)) {
		return interaction.editReply('You do not have the `MANAGE_MESSAGES` permission.');
	}

	channel.setRateLimitPerUser(slowmode).catch((e) => logger.error(e));

	interaction.editReply(`Slowmode in ${channel} is now ${slowmode} seconds`);
}
