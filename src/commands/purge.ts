import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	PermissionsBitField,
} from 'discord.js';
import { logger } from '../util';

export const name = 'purge';
export const description = 'Clears messages in the chat';
export const options = [
	{
		name: 'messages',
		description: 'The number of messages to clear',
		type: ApplicationCommandOptionType.Integer,
		required: true,
	},
];
export async function run(interaction: ChatInputCommandInteraction) {
	const number = interaction.options.getInteger('messages')!;

	if (!interaction.channel || !interaction.channel.isText() || !interaction.inCachedGuild()) return;

	if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageMessages)) {
		return interaction.editReply('You do not have the `MANAGE_MESSAGES` permission.');
	}

	await interaction.channel.bulkDelete(number + 1, true).catch((e) => logger.info(e));

	const message = await interaction.channel.send(`Deleted ${number} messages!`);
	setTimeout(() => message.delete(), 3000);
}
