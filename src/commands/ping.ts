import { Command } from "@megabot/command";

export default new Command({
	name: 'ping',
	description: 'Check the ping of the bot',
	execute(interaction) {
		interaction.editReply('Pong!');
	},
});
