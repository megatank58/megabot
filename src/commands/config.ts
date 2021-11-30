import {
	ApplicationCommandData,
	CommandInteraction,
	Constants,
	Formatters,
	Permissions,
} from 'discord.js';
import { Config, Roles } from '../schemas/Config';
import { getMongoManager } from 'typeorm';

export default {
	name: 'configure',
	description: 'Configure the bot settings for your server',
	options: [
		{
			name: 'logging',
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
	async execute(interaction: CommandInteraction) {
		if (!interaction.inCachedGuild()) return;

		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return interaction.editReply(
				`Only people with ${Formatters.inlineCode(
					'ADMINISTRATOR',
				)} permission can run this command`,
			);
		}
		const manager = getMongoManager();
		switch (interaction.options.getSubcommandGroup() + ' ' + interaction.options.getSubcommand()) {
			case 'logging channel': {
				const channelId = interaction.options.getChannel('channel')!.id;
				let config = await manager.findOne(Config, { guild: interaction.guildId });

				if (!config) {
					config = new Config();
					config.guild = interaction.guildId;
					config.logChannel = channelId;
				} else if (config) {
					config.logChannel = channelId;
				}

				manager.save(Config);

				interaction.editReply(`Log channel set to ${interaction.options.getChannel('channel')!}`);
				break;
			}
			case 'roles mute': {
				const muteRoleId = interaction.options.getRole('role')!.id;
				const roles = new Roles();
				roles.mute = muteRoleId;

				let config = await manager.findOne(Config, { guild: interaction.guildId });

				if (!config) {
					config = new Config();
					config.guild = interaction.guildId;
					config.roles = roles;
				} else if (config) {
					config.roles = roles;
				}

				manager.save(Config);

				interaction.editReply(`Mute role set to ${interaction.options.getRole('role')!}`);
				break;
			}
		}
	},
} as ApplicationCommandData;
