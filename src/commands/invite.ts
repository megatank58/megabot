import { CommandInteraction } from 'discord.js';

export default {
	name: 'invite',
	description: 'Invite MegaBot to your server!',
	ephemeral: true,
	async execute(interaction: CommandInteraction) {
		const invite = interaction.client.generateInvite({
			scopes: ['applications.commands', 'bot'],
			permissions: ['Administrator'],
		});
		interaction.editReply(`[Invite me](${invite} 'Link for invite') to your server!`);
	},
};
