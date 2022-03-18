import pino from 'pino';

const transport = pino.transport({
	targets: [
		{
			level: 'debug',
			target: 'pino-pretty',
			options: {
				ignore: 'pid,hostname',
			},
		},
		{
			level: 'trace',
			target: 'pino/file',
			options: { destination: './log.json' },
		},
	],
});

export const logger = pino(
	{
		timestamp: pino.stdTimeFunctions.isoTime,
	},
	transport,
);
