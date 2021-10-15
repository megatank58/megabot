import { CommandInteraction, ApplicationCommandData, TextChannel } from 'discord.js';
import { ChannelTypes } from 'discord.js/typings/enums';

export default {
	name: 'slowmode',
	description: 'Set the slowmode in a channel',
	options: [
		{
			name: 'channel',
			description: 'The channel to set slowmode for',
			type: 7,
			required: true,
			channel_types: ChannelTypes.GUILD_TEXT,
		},
		{
			name: 'slowmode',
			description: 'The slowmode to set',
			type: 4,
			required: true,
		},
	],
	default_permission: false,
	execute(interaction: CommandInteraction, args: any) {
		const channel = interaction.guild?.channels.resolve(args.channel);

		if (!(channel instanceof TextChannel)) return;

		channel.setRateLimitPerUser(args.slowmode);

		interaction.editReply(`Slowmode in ${channel} is now ${args.slowmode} seconds`);
	},
} as ApplicationCommandData;
