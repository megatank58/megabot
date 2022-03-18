import { REST } from '@discordjs/rest';
import { APIApplication, APIApplicationCommand, APIUser, Routes } from 'discord-api-types/v9';
import 'dotenv/config';
import { readdirSync } from 'fs';
import { logger } from './util/logger.js';

export async function main() {
	const guildCommands = [];
	const globalCommands = [];
	const commandFiles = readdirSync('.build/commands').filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const importedFile = await import(`./commands/${file}`);
		const commandData = {
			name: importedFile.name,
			description: importedFile.description,
			options: importedFile.options,
			default_permission: importedFile.defaultPermission,
		};
		logger.info(`ADD[COMMAND]: ${commandData.name}`);
		importedFile.guild_only ? guildCommands.push(commandData) : globalCommands.push(commandData);
	}

	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);
	const CLIENT_ID = ((await rest.get(Routes.user())) as APIUser).id;

	await rest.put(Routes.applicationCommands(CLIENT_ID!), {
		body: globalCommands,
	});

	logger.info(`DEPLOY[GLOBAL]: ${globalCommands.length} commands`);

	if (process.env.GUILD_ID) {
		rest.put(Routes.applicationGuildCommands(CLIENT_ID!, process.env.GUILD_ID), {
			body: guildCommands,
		});

		logger.info(`DEPLOY[GUILD]: ${guildCommands.length} commands`);
		logger.info(`GUILD: ${process.env.GUILD_ID}`);

		const commands = (await rest.get(
			Routes.applicationGuildCommands(CLIENT_ID!, process.env.GUILD_ID!),
		)) as APIApplicationCommand[];

		const evalCommand = commands.filter((_command) => _command.name === 'eval')[0];

		if (!evalCommand) return;

		await rest.put(
			Routes.applicationCommandPermissions(CLIENT_ID!, process.env.GUILD_ID!, evalCommand.id),
			{
				body: {
					permissions: [
						{
							id: ((await rest.get(Routes.oauth2CurrentApplication())) as APIApplication).owner?.id,
							type: 2,
							permission: true,
						},
					],
				},
			},
		);
	}
}

if (process.env.DEPLOY) void main();
