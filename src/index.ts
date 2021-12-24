import { Megabot } from '@megabot/client';
import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

config();

createConnection({
	type: 'mongodb',
	url: process.env.DATABASE_URL,
	logging: false,
	synchronize: false,
	entities: ['src/.build/schemas/*.js'],
	cli: {
		entitiesDir: 'src/schemas',
	},
	useUnifiedTopology: true,
});

new Megabot();