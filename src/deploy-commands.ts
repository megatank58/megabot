import { REST } from '@discordjs/rest';
import { APIUser, Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { logger } from './util/logger.js';

config();

const commands: unknown[] = [];
const commandFiles = readdirSync('.build/commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	commands.push(command.default);
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);
const CLIENT_ID = ((await rest.get(Routes.user('@me'))) as APIUser).id;

try {
	logger.info('Started refreshing application (/) commands.');

	await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID!), {
		body: commands,
	});

	logger.info('Successfully reloaded application (/) commands.');
} catch (error) {
	console.error(error);
}
