import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';

export class register {

	constructor(client: Client) {
		register.commands(client);
		register.events(client);
	}

	static async events(client: Client) {
		const eventFiles = readdirSync('.build/events');
		for (const file of eventFiles) {
			const event = await import(`../events/${file}`);
			event.default.once
				? client.once(event.default.name, (...args: any) => event.default.execute(...args))
				: client.on(event.default.name, (...args: any) => event.default.execute(...args));
		}
	}

	static async commands(client: Client) {
		client._commands = new Collection();

		const commandFiles = readdirSync('.build/commands');
		for (const file of commandFiles) {
			const command = await import(`../commands/${file}`);
			client._commands.set(command.default.name, command.default);
		}
	}
}
