import { Client, Intents, Options } from 'discord.js';
import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import { register, logger } from './util';

config();
createConnection({
	type: 'mongodb',
	url: process.env.DATABASE_URL,
	logging: false,
	synchronize: false,
	entities: ['.build/schemas/*.js'],
	cli: {
		entitiesDir: 'src/schemas',
	},
	useUnifiedTopology: true,
});

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
	allowedMentions: { repliedUser: true },
	failIfNotExists: false,
	presence: {
		activities: [
			{
				name: 'with a dog!',
				type: 'PLAYING',
				url: 'https://megabot.rocks',
			},
		],
		status: 'idle',
	},
	makeCache: Options.cacheWithLimits({
		GuildMemberManager: 10,
		MessageManager: 100,
		UserManager: 10,
		PresenceManager: 0,
	}),
});

if (process.argv.toString().toUpperCase().includes('--DEV')) {
	client.on('debug', (m) => logger.debug(m));
	client.on('warn', (m) => logger.warn(m));
}
client.on('error', (m) => logger.error(m));

new register(client);

client.login();
