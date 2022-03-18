import { Client, ActivityType } from 'discord.js';
import { logger } from '../util/logger.js';

export const name = 'ready';
export const once = true;
export function run(client: Client) {
        if (!client.user) return;
        client.user.setActivity(`${client.guilds.cache
size} servers!`, { type: ActivityType.Watching })
	logger.info(`INIT[${client.user.username}]`);
}
