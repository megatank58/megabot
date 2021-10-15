import { CommandInteraction, ApplicationCommandData } from 'discord.js';

export default {
	name: 'eval',
	description: 'Eval some code',
	options: [
		{
			name: 'code',
			description: 'The code to run',
			type: 3,
			required: true,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction, args: any) {
		const evaled = await eval(`(async () => { return ${args.code}})()`);
		interaction.editReply(`${evaled}`);
	},
} as ApplicationCommandData;