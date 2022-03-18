import { ActivityType, Client, GatewayIntentBits, Options, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { main as deploy } from './deploy-commands';
import 'dotenv/config';

export async function main() {
	const client = new Client({
		intents: [GatewayIntentBits.Guilds],
		allowedMentions: { repliedUser: false },
		failIfNotExists: false,
		presence: {
			activities: [
				{
					name: 'with a dog!',
					type: ActivityType.Playing,
					url: 'https://megabot.rocks',
				},
			],
			status: 'idle',
		},
		makeCache: Options.cacheWithLimits({
			GuildMemberManager: 10,
			UserManager: 10,
			PresenceManager: 10,
		}),
	});

	client._commands = new Collection();
	client._deploy = deploy;

	const eventFiles = readdirSync('.build/events').filter((file) => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = await import(`./events/${file}`);
		event.once
			? client.once(event.name, (...args: any) => event.run(...args, client))
			: client.on(event.name, (...args: any) => event.run(...args, client));
	}

	const commandFiles = readdirSync('.build/commands').filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const importedFile = await import(`./commands/${file}`);
		client._commands.set(importedFile.name, {
			name: importedFile.name,
			ephemeral: importedFile.ephemeral,
			guild_only: importedFile.guild_only,
			run: importedFile.run,
			complete: importedFile.complete,
			menu: importedFile.menu,
		});
	}

	await client.login();
}

main();
