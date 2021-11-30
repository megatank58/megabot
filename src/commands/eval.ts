import {
	CommandInteraction,
	ApplicationCommandData,
	Constants,
	MessageEmbed,
	Formatters,
	MessageAttachment,
} from 'discord.js';

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
	guildOnly: true,
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const code = interaction.options.getString('code')!;
		const embed = new MessageEmbed()
			.setColor('BLUE')
			.addField('📥 Input', Formatters.codeBlock(code.substring(0, 1015), 'js'))
			.setFooter('Feed me code!');
		try {
			let evaled = eval(`(async () => { ${code} })().catch(e => { return "Error: " + e })`);
			Promise.resolve(evaled).then(async (result) => {
				evaled = result;
				if (typeof evaled != 'string') evaled = (await import('util')).inspect(evaled);
				if (evaled.length > 1015) {
					const evalOutputFile = new MessageAttachment(Buffer.from(`${evaled}`), 'evalOutput.js');
					const files = [evalOutputFile];
					embed
						.addField('📤 Output', 'Output is in file preview above')
						.setTitle('✅ Evaluation Completed');
					interaction.editReply({ embeds: [embed], files });
				} else {
					embed
						.addField('📤 Output', Formatters.codeBlock(evaled.substring(0, 1015), 'js'))
						.setTitle('✅ Evaluation Completed');
					interaction.editReply({ embeds: [embed] });
				}
			});
		} catch (e) {
			let error = e;
			if (typeof e == 'string') {
				error = e
					.replace(/`/g, '`' + String.fromCharCode(8203))
					.replace(/@/g, '@' + String.fromCharCode(8203));
			}
			embed
				.addField(
					'📤 Output',
					Formatters.codeBlock((error as string).toString().substring(0, 1014), 'fix'),
				)
				.setTitle('❌ Evaluation Failed');
			interaction.editReply({ embeds: [embed] });
		}
	},
} as ApplicationCommandData;
