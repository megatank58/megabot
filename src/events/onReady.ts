import { Client } from 'discord.js';
import { logger } from '../util/logger.js';

export const name = 'ready';
export const once = true;
export function run(client: Client) {
	logger.info(`${client.user?.username} has started`);
}
