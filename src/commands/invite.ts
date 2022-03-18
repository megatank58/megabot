import { CommandInteraction, OAuth2Scopes } from 'discord.js';

export const name = 'invite';
export const description = 'Invite Akemi to your server!';
export const ephemeral = true;
export function run(interaction: CommandInteraction) {
	const invite = interaction.client.generateInvite({
		scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
		permissions: ['Administrator'],
	});
	interaction.editReply(`[Invite me](${invite} 'Link for invite') to your server!`);
}
