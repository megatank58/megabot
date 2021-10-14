import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { readdirSync } from 'fs';

config();

const commands = [];
const commandFiles = readdirSync('.build/commands');

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
	for (const file of commandFiles) {
		const command = await import(`../.build/commands/${file}`);
		commands.push({ name: command.default.name, description: command.default.description, options: command.default.options });
	}

	if (process.env.GUILD_ID) return rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID), { body: commands });

	rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands });
})();
