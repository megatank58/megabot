import { Client, Intents, Collection, Options } from 'discord.js';
import { readdirSync } from 'fs';
import { config } from 'dotenv';

config();

declare module 'discord.js' {
	// eslint-disable-next-line
	interface Client {
		_commands: Collection<
			string,
			ApplicationCommand & {
				ephemeral: boolean;
				execute: (interaction: CommandInteraction) => any;
				complete: (interaction: AutocompleteInteraction) => any;
			}
		>;
		timeouts: {
			guildId: string;
			memberId: string;
			value: any;
		}[];
	}
	interface GuildMember {
		messages: Message[];
	}
}

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
	allowedMentions: { repliedUser: true },
	failIfNotExists: false,
	presence: {
		activities: [{
			name: 'with a dog!',
			type: 'PLAYING',
			url: 'https://megabot.rocks',
		}],
		status: 'idle',
	},
	makeCache: Options.cacheWithLimits({
		GuildMemberManager: 10,
		MessageManager: 100,
		UserManager: 10,
		PresenceManager: 0,
	}),
});
client._commands = new Collection();
client.timeouts = [];

const eventFiles = readdirSync('.build/events');
for (const file of eventFiles) {
	(async () => {
		const event = await import(`./events/${file}`);
		event.default.once
			? client.once(event.default.name, (...args: any) => event.default.execute(...args))
			: client.on(event.default.name, (...args: any) => event.default.execute(...args));
	})();
}

const commandFiles = readdirSync('.build/commands');
for (const file of commandFiles) {
	(async () => {
		const command = await import(`./commands/${file}`);
		client._commands.set(command.default.name, command.default);
	})();
}

client.login();
