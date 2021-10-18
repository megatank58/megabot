import { CommandInteraction, ApplicationCommandData, TextChannel, Constants } from 'discord.js';

export default {
	name: 'slowmode',
	description: 'Set the slowmode in a channel',
	options: [
		{
			name: 'channel',
			description: 'The channel to set slowmode for',
			type: Constants.ApplicationCommandOptionTypes.CHANNEL,
			required: true,
			channel_types: [Constants.ChannelTypes.GUILD_TEXT],
		},
		{
			name: 'slowmode',
			description: 'The slowmode to set',
			type: Constants.ApplicationCommandOptionTypes.INTEGER,
			required: true,
		},
	],
	default_permission: false,
	execute(interaction: CommandInteraction) {
		const channel = interaction.options.getChannel('channel');
		const slowmode = interaction.options.getInteger('slowmode');

		if (!(channel instanceof TextChannel) || !channel || !slowmode) return;

		channel.setRateLimitPerUser(slowmode);

		interaction.editReply(`Slowmode in ${channel} is now ${slowmode} seconds`);
	},
} as ApplicationCommandData;
