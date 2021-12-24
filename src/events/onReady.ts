import { logger } from '@megabot/logger';

export default {
	name: 'ready',
	once: true,
	execute() {
	    logger.info('Bot has started!');
	},
};
