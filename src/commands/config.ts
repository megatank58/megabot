import { ApplicationCommandData, CommandInteraction, Constants } from 'discord.js';
import fetch from 'node-fetch';

export default {
	name: 'config',
	description: 'Config the bot',
	options: [
		{
			name: 'log',
			description: 'Set the log settings for the bot',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
			options: [
				{
					name: 'channel',
					description: 'Set the log channel for the bot',
					type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
					options: [
						{
							name: 'channel',
							description: 'The channel where the bot will send the logs',
							type: Constants.ApplicationCommandOptionTypes.CHANNEL,
							channel_types: [Constants.ChannelTypes.GUILD_TEXT],
							required: true,
						},
					],
				},
			],
		},
		{
			name: 'roles',
			description: 'Set the role settings for the bot',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
			options: [
				{
					name: 'mute',
					description: 'Set the mute role for the bot',
					type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
					options: [
						{
							name: 'role',
							description: 'The role which the bot will use for mutes',
							type: Constants.ApplicationCommandOptionTypes.ROLE,
							required: true,
						},
					],
				},
			],
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case 'logchannel':
				fetch('https://database.bloxdatabase.repl.co/set', {
					method: 'POST',
					body: JSON.stringify({
						secret: process.env.SECRET,
						db: 'logchannels',
						key: interaction.guild?.id,
						data: { channel: interaction.options.getChannel('channel')!.id },
					}),
					headers: { 'Content-Type': 'application/json' },
				});
				interaction.editReply(`Log channel set to ${interaction.options.getChannel('channel')!}`);
				break;
			case 'muterole':
				fetch('https://database.bloxdatabase.repl.co/set', {
					method: 'POST',
					body: JSON.stringify({
						secret: process.env.SECRET,
						db: 'muteroles',
						key: interaction.guild?.id,
						data: { role: interaction.options.getRole('role')!.id },
					}),
					headers: { 'Content-Type': 'application/json' },
				});
				interaction.editReply(`Mute role set to ${interaction.options.getRole('role')!}`);
				break;
		}
	},
} as ApplicationCommandData;
