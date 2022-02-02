import { Client } from 'discord.js';
import { logger } from '../util/logger.js';

export default {
	name: 'ready',
	once: true,
	execute(client: Client) {
		logger.info(`${client.user?.username} has started`);
	},
};
