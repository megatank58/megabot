import { REST } from '@discordjs/rest';
import { logger } from '@megabot/logger';
import { Routes, APIApplicationCommand } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { readdirSync } from 'fs';

export async function run() {
	config();

	const guildCommands = [];
	const globalCommands = [];
	const commandFiles = readdirSync('src/.build/commands');

	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

	for (const file of commandFiles) {
		const command = await import(`../src/.build/commands/${file}`);
		const commandData = {
			name: command.default.name,
			description: command.default.description,
			options: command.default.options,
			default_permission: command.default.default_permission,
		};
		logger.info(`Added command: ${commandData.name}`);
		command.default.guildOnly ? guildCommands.push(commandData) : globalCommands.push(commandData);
	}

	await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
		body: globalCommands,
	});

	logger.info(`Commands deployed: ${globalCommands.length} commands`)

	if (process.env.DISCORD_GUILD_ID) {
		rest.put(
			Routes.applicationGuildCommands(
				process.env.DISCORD_CLIENT_ID!,
				process.env.DISCORD_GUILD_ID,
			),
			{
				body: guildCommands,
			},
		);

		logger.info(`Commands deployed: ${guildCommands.length} commands`)
		logger.info(`Guild: ${process.env.DISCORD_GUILD_ID}`)

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
	}
}

run();
