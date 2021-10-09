import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types';
import { config } from 'dotenv';
import { readdirSync } from 'fs';

config();

const commands = [];
const commandFiles = readdirSync('.build/commands');

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
	for (const file of commandFiles) {
		const command = await import(`.build/commands/${file}`);
		commands.push({ name: command.default.name });
	}

	rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands });
})();
