import { Message } from 'discord.js';

export default {
	name: 'messageCreate',
	async execute(message: Message) {
		if (!message.guild || !message.member || message.member.roles.highest.position >= 34) return;

		const regex =
			/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
		if (
			message.content.match(regex) &&
			message.member &&
			!message.deleted
		) {
			message.delete().catch(() => undefined);
		}

		if (!message.member.messages) message.member.messages = [];

		if (
			message.member.messages[0]?.cleanContent === message.cleanContent &&
			message.member.messages[1]?.cleanContent === message.cleanContent
		) {
			message.member.messages[0].delete().catch(() => undefined);
			message.member.messages[1].delete().catch(() => undefined);
			message.delete().catch(() => undefined);
			return (message.member.messages = []);
		}
		message.member.messages.push(message);
		setTimeout(() => {
			if (!message.member || !message.member.messages) return;
			const index = message.member.messages.indexOf(message);
			if (index > -1) {
				message.member.messages.splice(index, 1);
			}
		}, 5000);
	},
};
