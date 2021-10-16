import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { readdirSync } from 'fs';

config();

const guildCommands = [];
const globalCommands = [];
const commandFiles = readdirSync('.build/commands');

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
	for (const file of commandFiles) {
		const command = await import(`../.build/commands/${file}`);
		const commandData = { name: command.default.name, description: command.default.description, options: command.default.options, default_permission: command.default.default_permission };
		command.default.isGlobal ? globalCommands.push(commandData) : guildCommands.push(commandData);
	}

	if (process.env.GUILD_ID) rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID), { body: guildCommands });

	rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: globalCommands });
})();
