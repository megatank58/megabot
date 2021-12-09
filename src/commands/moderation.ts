import {
	ApplicationCommandData,
	CommandInteraction,
	Constants,
	Formatters,
	MessageEmbed,
	TextChannel,
} from 'discord.js';
import { getMongoManager } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Warn, Warnings } from '../schemas/Warns';
import { Config } from '../schemas/Config';
import { logger } from '../util';

export default {
	name: 'moderation',
	description: 'Moderation commands!',
	options: [
		{
			name: 'ban',
			description: 'bans a member',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			options: [
				{
					name: 'member',
					description: 'The member to ban',
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason for ban',
					type: Constants.ApplicationCommandOptionTypes.STRING,
				},
			],
		},
		{
			name: 'clearwarn',
			description: 'Clear the warnings of member',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			options: [
				{
					name: 'member',
					description: 'The warnings of the member to clear',
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
			],
		},
		{
			name: 'delwarn',
			description: 'Delete the warnings of member',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			options: [
				{
					name: 'member',
					description: 'The warnings of the member to delete',
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
				{
					name: 'warn',
					description: 'The ID of the warn',
					type: Constants.ApplicationCommandOptionTypes.STRING,
					required: true,
				},
			],
		},
		{
			name: 'kick',
			description: 'Kick a member',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			options: [
				{
					name: 'member',
					description: 'The member to kick',
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason for kick',
					type: Constants.ApplicationCommandOptionTypes.STRING,
				},
			],
		},
		{
			name: 'mute',
			description: 'Mute a member',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			options: [
				{
					name: 'member',
					description: 'The member to mute',
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
				{
					name: 'time',
					description: 'The time for mute',
					type: Constants.ApplicationCommandOptionTypes.INTEGER,
					required: true,
					choices: [
						{
							name: '1 hours',
							value: 3_600_000,
						},
						{
							name: '3 hours',
							value: 10_800_000,
						},
						{
							name: '6 hours',
							value: 21_600_000,
						},
						{
							name: '12 hours',
							value: 43_200_000,
						},
						{
							name: '1 day',
							value: 86_400_000,
						},
					],
				},
				{
					name: 'reason',
					description: 'The reason for mute',
					type: Constants.ApplicationCommandOptionTypes.STRING,
				},
			],
		},
		{
			name: 'purge',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: 'Clears messages in the chat',
			options: [
				{
					name: 'messages',
					description: 'The number of messages to clear',
					type: Constants.ApplicationCommandOptionTypes.INTEGER,
					required: true,
				},
			],
		},
		{
			name: 'slowmode',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
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
		},
		{
			name: 'unmute',
			description: 'Unmute a member',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			options: [
				{
					name: 'member',
					description: 'The member to unmute',
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason for unmute',
					type: Constants.ApplicationCommandOptionTypes.STRING,
				},
			],
		},
		{
			name: 'warn',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: 'Warn a member',
			options: [
				{
					name: 'member',
					description: 'The member to warn',
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason for warn',
					type: Constants.ApplicationCommandOptionTypes.STRING,
				},
			],
		},
		{
			name: 'warnings',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: 'See the warnings of member',
			options: [
				{
					name: 'member',
					description: 'The warnings of the member to see',
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
			],
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		if (!interaction.inCachedGuild()) return;

		const command = interaction.options.getSubcommand();
		const member = interaction.options.getMember('member')!;
		const reason = interaction.options.getString('reason')!;
		const manager = getMongoManager();

		switch (command) {
			case 'ban': {
				if (
					interaction.member.roles.highest.position < member.roles.highest.position ||
					interaction.guild.ownerId === interaction.member.id
				) {
					return interaction.editReply('This person is higher than you!');
				}

				if (
					(await interaction.guild.members.fetch(interaction.client.user!.id)).roles.highest.position <
					member.roles.highest.position
				) {
					return interaction.editReply('My role is below this person!');
				}

				member.user
					.send({
						embeds: [
							{
								description: `You were banned in **${interaction.guild?.name}** ${
									reason ? `**|| ${reason}**` : ''
								}`,
								color: 'RED',
							},
						],
					})
					.catch();

				member.ban({ reason: reason }).catch((e) => logger.info(e));

				interaction.editReply({
					embeds: [
						{
							description: `:white_check_mark: ***${member} was banned.*** ${
								reason ? `**|| ${reason}**` : ''
							}`,
							color: 'GREEN',
						},
					],
				});
				break;
			}
			case 'clearwarn': {
				await manager.findOneAndDelete(Warnings, {
					guild: interaction.guildId,
					member: member.id,
				});

				interaction.editReply(`Deleted all warnings for ${member}`);
				break;
			}
			case 'delwarn': {
				const id = interaction.options.getString('warn')!;

				const warnings = await manager.findOne(Warnings, {
					guild: interaction.guildId,
					member: member.id,
				});

				if (!warnings) return interaction.editReply('No warning found for the user.');

				warnings.warns = warnings?.warns.filter((warn) => warn.id !== id);

				manager.save(warnings);

				interaction.editReply(`Deleted \`${id}\` warning for ${member}`);
				break;
			}
			case 'kick': {
				if (
					interaction.member.roles.highest.position < member.roles.highest.position ||
					interaction.guild.ownerId === interaction.member.id
				) {
					return interaction.editReply('This person is higher than you!');
				}

				if (
					(await interaction.guild.members.fetch(interaction.client.user!.id)).roles.highest.position <
					member.roles.highest.position
				) {
					return interaction.editReply('My role is below this person!');
				}

				member.user
					.send({
						embeds: [
							{
								description: `You were kicked from **${interaction.guild?.name}** ${
									reason ? `**|| ${reason}**` : ''
								}`,
								color: 'RED',
							},
						],
					})
					.catch();

				member.kick(reason).catch((e) => logger.info(e));

				interaction.editReply({
					embeds: [
						{
							description: `:white_check_mark: ***${member} was kicked.*** ${
								reason ? `**|| ${reason}**` : ''
							}`,
							color: 'GREEN',
						},
					],
				});
				break;
			}
			case 'mute': {
				const time = interaction.options.getInteger('time')!;

				const config = await manager.findOne(Config, { guild: interaction.guildId });

				if (!config?.roles.mute) {
					return interaction.editReply(
						`Mute role has not been configured, yet. Configure it with ${Formatters.inlineCode(
							'/configure roles mute',
						)}`,
					);
				}

				member.roles.add(config.roles.mute).catch((e) => logger.info(e));

				setTimeout(async () => {
					if ((await member.fetch()).roles.cache.has(config.roles.mute)) {
						member.roles.remove(config.roles.mute);
					}
				}, time);

				interaction.editReply({
					embeds: [
						{
							description: `:white_check_mark: ***${member} was muted${
								time ? ` for ${new Date(time).getHours()}hrs` : ''
							}.*** ${reason ? `**|| ${reason}**` : ''}`,
							color: 'GREEN',
						},
					],
				});
				break;
			}
			case 'purge': {
				const channel = interaction.channel;
				const number = interaction.options.getInteger('messages')!;

				if (!channel || !(channel instanceof TextChannel)) return;

				await channel.bulkDelete(number + 1, true).catch((e) => logger.info(e));

				const message = await channel.send(`Deleted ${number} messages!`);
				setTimeout(() => message.delete(), 3000);
				break;
			}
			case 'slowmode': {
				const channel = interaction.options.getChannel('channel');
				const slowmode = interaction.options.getInteger('slowmode');

				if (!(channel instanceof TextChannel) || !channel || !slowmode) return;

				channel.setRateLimitPerUser(slowmode).catch((e) => logger.info(e));

				interaction.editReply(`Slowmode in ${channel} is now ${slowmode} seconds`);
				break;
			}
			case 'unmute': {
				const config = await manager.findOne(Config, { guild: interaction.guildId });

				if (!config?.roles.mute) {
					return interaction.editReply(
						`Mute role has not been configured, yet. Configure it with ${Formatters.inlineCode(
							'/configure roles mute',
						)}`,
					);
				}

				member.roles.remove(config.roles.mute).catch((e) => logger.info(e));

				interaction.editReply({
					embeds: [
						{
							description: `:white_check_mark: ***${member} was unmuted.*** ${
								reason ? `**|| ${reason}**` : ''
							}`,
							color: 'GREEN',
						},
					],
				});
				break;
			}
			case 'warn': {
				const warnId = uuid();

				const warn = new Warn();
				warn.id = warnId;
				warn.reason = reason;
				warn.moderator = interaction.member.id;

				let warnings = await manager.findOne(Warnings, {
					guild: interaction.guildId,
					member: member.id,
				});

				if (!warnings) {
					warnings = new Warnings();
					warnings.guild = interaction.guildId;
					warnings.member = member.id;
					warnings.warns = [warn];
				} else if (warnings) {
					warnings.warns.push(warn);
				}

				manager.save(warnings);

				interaction.editReply({
					embeds: [
						{
							description: `:white_check_mark: ***${member} was warned.*** ${
								reason ? `**|| ${reason}**` : ''
							}`,
							color: 'GREEN',
						},
					],
				});
				break;
			}
			case 'warnings': {
				const embed = new MessageEmbed();

				const warnings = await manager.findOne(Warnings, {
					guild: interaction.guildId,
					member: member.id,
				});

				if (!warnings?.warns || warnings?.warns.length === 0) {
					embed.setDescription('No warnings.');
					embed.setColor('BLUE');

					return interaction.editReply({
						embeds: [embed],
					});
				}

				for (const warn of warnings.warns) {
					if (embed.fields.length < 24) {
						embed.addField(
							`ID: ${warn.id} | Moderator: ${warn.moderator}`,
							`Reason: ${warn.reason}`,
						);
					}
				}

				embed.setAuthor(member.displayName, member.displayAvatarURL()).setColor('RED');

				interaction.editReply({
					embeds: [embed],
				});
			}
		}
	},
} as ApplicationCommandData;
