import { CommandInteraction, ApplicationCommandData, Constants } from 'discord.js';

export default {
	name: 'eval',
	description: 'Eval some code',
	options: [
		{
			name: 'code',
			description: 'The code to run',
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const code = interaction.options.getString('code');
		const evaled = await eval(`(async () => { return ${code}})()`);
		interaction.editReply(`${evaled}`);
	},
} as ApplicationCommandData;