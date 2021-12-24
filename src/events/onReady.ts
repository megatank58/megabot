import { logger } from '@megabot/logger';
import { Event } from '@megabot/event';

export default new Event({
	name: 'ready',
	once: true,
	execute() {
	    logger.info('Bot has started!');
	},
});
