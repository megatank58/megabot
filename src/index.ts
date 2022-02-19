import { ActivityType, Client, GatewayIntentBits, Options, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { config } from 'dotenv';

config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
	allowedMentions: { repliedUser: false },
	failIfNotExists: false,
	presence: {
		activities: [
			{
				name: 'with a dog!',
				type: ActivityType.Game,
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

const eventFiles = readdirSync('.build/events').filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = await import(`${process.cwd()}/.build/events/${file}`);
	event.default.once
		? client.once(event.default.name, (...args: any) => event.default.execute(...args, client))
		: client.on(event.default.name, (...args: any) => event.default.execute(...args, client));
}

const commandFiles = readdirSync('.build/commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = await import(`${process.cwd()}/.build/commands/${file}`);
	client._commands.set(command.default.name, command.default);
}

client.login();
