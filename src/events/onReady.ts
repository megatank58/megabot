import { logger } from '../util';

export default {
	name: 'ready',
	once: true,
	execute() {
	    logger.info('Bot has started!');
	},
};
