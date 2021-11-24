import { REST } from '@discordjs/rest';
import { Routes, APIApplicationCommand } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { readdirSync } from 'fs';

async function run() {
	config();

	const guildCommands = [];
	const globalCommands = [];
	const commandFiles = readdirSync('.build/commands');

	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

	for (const file of commandFiles) {
		const command = await import(`../.build/commands/${file}`);
		const commandData = {
			name: command.default.name,
			description: command.default.description,
			options: command.default.options,
			default_permission: command.default.default_permission,
		};
		command.default.isGlobal ? globalCommands.push(commandData) : guildCommands.push(commandData);
	}

	await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
		body: globalCommands,
	});

	if (process.env.DISCORD_GUILD_ID) {
		rest.put(
			Routes.applicationGuildCommands(
				process.env.DISCORD_CLIENT_ID!,
				process.env.DISCORD_GUILD_ID!,
			),
			{
				body: guildCommands,
			},
		);

		const commands = (await rest.get(
			Routes.applicationGuildCommands(
				process.env.DISCORD_CLIENT_ID!,
				process.env.DISCORD_GUILD_ID!,
			),
		)) as APIApplicationCommand[];

		const evalCommand = commands.filter((_command) => _command.name === 'eval')[0];

		if (!evalCommand) return;

		await rest.put(
			Routes.applicationCommandPermissions(
				process.env.DISCORD_CLIENT_ID!,
				process.env.DISCORD_GUILD_ID!,
				evalCommand.id,
			),
			{ body: { permissions: [{ id: process.env.DISCORD_OWNER_ID!, type: 2, permission: true }] } },
		);

		const permissionCommand = commands.filter((_command) => _command.name === 'permission')[0];

		if (!permissionCommand) return;

		await rest.put(
			Routes.applicationCommandPermissions(
				process.env.DISCORD_CLIENT_ID!,
				process.env.DISCORD_GUILD_ID!,
				permissionCommand.id,
			),
			{ body: { permissions: [{ id: process.env.DISCORD_OWNER_ID!, type: 2, permission: true }] } },
		);
	}
}

run();
