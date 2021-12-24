import { Command } from '@megabot/command';

export default new Command({
	name: 'invite',
	description: 'Invite MegaBot to your server!',
	ephemeral: true,
	async execute(interaction) {
		const invite = interaction.client.generateInvite({
			scopes: ['applications.commands', 'bot'],
			permissions: ['ADMINISTRATOR'],
		});
		interaction.editReply(`[Invite me](${invite} 'Link for invite') to your server!`);
	},
});
