import {
	ApplicationCommandData,
	GuildMember,
	CommandInteraction,
	Constants,
	MessageEmbed,
	TextChannel,
} from 'discord.js';
import { v4 as uuid } from 'uuid';
import fetch from 'node-fetch';

export default {
	name: 'mod',
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
					type: Constants.ApplicationCommandOptionTypes.STRING,
					required: true,
				},
			],
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const command = interaction.options.getSubcommand();

		switch (command) {
			case 'ban': {
				const member = interaction.options.getMember('member')!;
				const reason = interaction.options.getString('reason')!;

				if (!member || !(member instanceof GuildMember)) return;

				member.user.send({
					embeds: [
						{
							description: `You were banned in **${interaction.guild?.name}** ${
								reason ? `**|| ${reason}**` : ''
							}`,
							color: 'RED',
						},
					],
				});

				member.ban({ reason: reason });

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
				const member = interaction.options.getMember('member');
				if (!member || !(member instanceof GuildMember)) return;

				const body = {
					secret: process.env.SECRET,
					db: 'warns',
					key: member.id,
				};

				await fetch(`${process.env.DATABASE_URL}/delete`, {
					method: 'POST',
					body: JSON.stringify(body),
					headers: { 'Content-Type': 'application/json' },
				});

				interaction.editReply(`Deleted all warnings for ${member}`);
				break;
			}
			case 'delwarn': {
				const member = interaction.options.getMember('member')!;
				const id = interaction.options.getString('warn')!;
				if (!(member instanceof GuildMember)) return;

				const body = {
					secret: process.env.SECRET,
					db: 'warns',
					key: member.id,
					data: id,
				};

				await fetch(`${process.env.DATABASE_URL}/pop`, {
					method: 'POST',
					body: JSON.stringify(body),
					headers: { 'Content-Type': 'application/json' },
				});

				interaction.editReply(`Deleted \`${id}\` warning for ${member}`);
				break;
			}
			case 'kick': {
				const member = interaction.options.getMember('member')!;
				const reason = interaction.options.getString('reason')!;

				if (!member || !(member instanceof GuildMember)) return;

				member.user.send({
					embeds: [
						{
							description: `You were kicked from **${interaction.guild?.name}** ${
								reason ? `**|| ${reason}**` : ''
							}`,
							color: 'RED',
						},
					],
				});

				member.kick(reason);

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
				const member = interaction.options.getMember('member')!;
				const reason = interaction.options.getString('reason');
				const time = interaction.options.getInteger('time')!;

				const body = {
					secret: process.env.SECRET,
					db: 'muteroles',
					key: interaction.guild?.id,
				};

				const data = await (
					await fetch(`${process.env.DATABASE_URL}/get`, {
						method: 'POST',
						body: JSON.stringify(body),
						headers: { 'Content-Type': 'application/json' },
					})
				).json();

				if (!member || !(member instanceof GuildMember)) return;

				member.roles.add(data.role);

				const timeout = setTimeout(async () => {
					if ((await member.fetch()).roles.cache.has(data.role)) {
						member.roles.remove(data.role);
					}
				}, time);

				interaction.client.timeouts.push({
					guildId: interaction.guildId!,
					memberId: member.id,
					value: timeout,
				});

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

				await channel.bulkDelete(number + 1, true);

				const message = await channel.send(`Deleted ${number} messages!`);
				setTimeout(() => message.delete(), 3000);
				break;
			}
			case 'slowmode': {
				const channel = interaction.options.getChannel('channel');
				const slowmode = interaction.options.getInteger('slowmode');

				if (!(channel instanceof TextChannel) || !channel || !slowmode) return;

				channel.setRateLimitPerUser(slowmode);

				interaction.editReply(`Slowmode in ${channel} is now ${slowmode} seconds`);
				break;
			}
			case 'unmute': {
				const member = interaction.options.getMember('member')!;
				const reason = interaction.options.getString('reason')!;

				const body = {
					secret: process.env.SECRET,
					db: 'muteroles',
					key: interaction.guild?.id,
				};

				const data = await (
					await fetch(`${process.env.DATABASE_URL}/get`, {
						method: 'POST',
						body: JSON.stringify(body),
						headers: { 'Content-Type': 'application/json' },
					})
				).json();

				if (!member || !(member instanceof GuildMember)) return;

				member.roles.remove(data.role);

				clearTimeout(
					interaction.client.timeouts.find(
						(timeout) => timeout.guildId === interaction.guildId! && timeout.memberId === member.id,
					)?.value,
				);

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
				const member = interaction.options.getMember('member');
				const reason = interaction.options.getString('reason') ?? '';

				if (!member || !(member instanceof GuildMember)) return;

				const id = uuid();
				const body = {
					secret: process.env.SECRET,
					db: 'warns',
					key: member.id,
					data: { id, reason, moderator: interaction.user.tag },
				};

				fetch(`${process.env.DATABASE_URL}/push`, {
					method: 'POST',
					body: JSON.stringify(body),
					headers: { 'Content-Type': 'application/json' },
				});
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
				const member = interaction.options.getMember('member');
				if (!member || !(member instanceof GuildMember)) return;

				const embed = new MessageEmbed();

				const body = {
					secret: process.env.SECRET,
					db: 'warns',
					key: member.id,
				};

				const data = await fetch(`${process.env.DATABASE_URL}/get`, {
					method: 'POST',
					body: JSON.stringify(body),
					headers: { 'Content-Type': 'application/json' },
				});

				const json = await data.json().catch(() => null);

				if (!json || json.length == 0) {
					embed.setDescription('No warnings.');
					embed.setColor('BLUE');

					return interaction.editReply({
						embeds: [embed],
					});
				}

				for (const warn of json) {
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
