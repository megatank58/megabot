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
				{
					name: 'moderator',
					description: 'Set the moderator role',
					type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
					options: [
						{
							name: 'role',
							description: 'People with this role can use moderation commands',
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

		const manager = getMongoManager();

		let config = await manager.findOne(Config, { guild: interaction.guildId });

		if (
			!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && 
			!interaction.member.roles.cache.has(`${config?.roles?.moderator}`)
		) {
			return interaction.editReply(
				`Only people with ${Formatters.inlineCode(
					'ADMINISTRATOR',
				)} permission or the ${config?.roles?.moderator ? interaction.guild.roles.cache.get(config?.roles?.moderator)?.toString() : 'moderator'} role can run this command`,
			);
		}

		switch (interaction.options.getSubcommandGroup() + ' ' + interaction.options.getSubcommand()) {
			case 'logging channel': {
				const channelId = interaction.options.getChannel('channel')!.id;

				if (!config) {
					config = new Config();
					config.guild = interaction.guildId;
					config.logChannel = channelId;
				} else if (config) {
					config.logChannel = channelId;
				}

				manager.save(config);

				interaction.editReply(`Log channel set to ${interaction.options.getChannel('channel')!}`);
				break;
			}
			case 'roles mute': {
				const muteRoleId = interaction.options.getRole('role')!.id;
				const roles = new Roles();
				roles.mute = muteRoleId;

				if (!config) {
					config = new Config();
					config.guild = interaction.guildId;
					config.roles = roles;
				} else if (config) {
					config.roles = roles;
				}

				manager.save(config);

				interaction.editReply(`Mute role set to ${interaction.options.getRole('role')!}`);
				break;
			}
			case 'roles moderator': {
				const modRoleId = interaction.options.getRole('role')!.id;
				const roles = new Roles();
				roles.moderator = modRoleId;

				let config = await manager.findOne(Config, { guild: interaction.guildId });

				if (!config) {
					config = new Config();
					config.guild = interaction.guildId;
					config.roles = roles;
				} else if (config) {
					config.roles = roles;
				}

				manager.save(config);

				await interaction.client.application?.commands.fetch();

				interaction.guild?.commands.permissions.set({
					command: interaction.client.application?.commands.cache.find(
						(command) => command.name === 'moderator',
					)?.id!,
					permissions: [
						{
							id: modRoleId,
							type: 'ROLE',
							permission: true,
						},
					],
				});

				interaction.editReply(`Moderator role set to ${interaction.options.getRole('role')!}`);
				break;
			}
		}
	},
} as ApplicationCommandData;
