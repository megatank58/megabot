import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';

export async function register(client: Client) {
	const eventFiles = readdirSync('src/.build/events').filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = await import(`${process.cwd()}/src/.build/events/${file}`);
		event.default.once
			? client.once(event.default.name, (...args: any) => event.default.execute(...args))
			: client.on(event.default.name, (...args: any) => event.default.execute(...args));
	}

	client._commands = new Collection();

	const commandFiles = readdirSync('src/.build/commands').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = await import(`${process.cwd()}/src/.build/commands/${file}`);
		client._commands.set(command.default.name, command.default);
	}
}
