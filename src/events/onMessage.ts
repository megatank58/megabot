import { Message } from 'discord.js';

export default {
	name: 'messageCreate',
	async execute(message: Message) {
		const regex =
			/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
		if (
			message.content.match(regex) &&
			message.member &&
			message.member.roles.highest.position < 34 &&
			!message.deleted
		) {
			message.delete().catch(() => undefined);
		}
	},
};
