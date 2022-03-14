import { CommandInteraction, OAuth2Scopes } from 'discord.js';

export default {
	name: 'invite',
	description: 'Invite MegaBot to your server!',
	ephemeral: true,
	async execute(interaction: CommandInteraction) {
		const invite = interaction.client.generateInvite({
			scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
			permissions: ['Administrator'],
		});
		interaction.editReply(`[Invite me](${invite} 'Link for invite') to your server!`);
	},
};
