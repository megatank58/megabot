import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Formatters,
	MessageAttachment,
} from 'discord.js';

export const name = 'eval';
export const description = 'Evaluate code';
export const guild_only = true;
export const default_permission = false;
export const options = [
	{
		name: 'code',
		description: 'The code to execute',
		type: ApplicationCommandOptionType.String,
		required: true,
	},
];
export function run(interaction: ChatInputCommandInteraction) {
	const code = interaction.options.getString('code', true);
	const embed = new EmbedBuilder()
		.setColor('Blue')
		.addFields({ name: '📥 Input', value: Formatters.codeBlock(code.substring(0, 1015)) })
		.setFooter({ text: 'Feed me code!' });
	try {
		let evaled = eval(`(async () => { return ${code} })().catch(e => { return "Error: " + e })`);
		Promise.resolve(evaled).then(async (result) => {
			evaled = result;
			if (typeof evaled != 'string') evaled = (await import('util')).inspect(evaled);
			if (evaled.length > 1015) {
				const evalOutputFile = new MessageAttachment(Buffer.from(`${evaled}`), 'evalOutput.js');
				const files = [evalOutputFile];
				embed
					.addFields({ name: '📤 Output', value: 'Output is in file preview above' })
					.setTitle('✅ Evaluation Completed');
				interaction.editReply({ embeds: [embed], files });
			} else {
				embed
					.addFields({
						name: '📤 Output',
						value: Formatters.codeBlock(evaled.substring(0, 1015)),
					})
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
			.addFields({
				name: '📤 Output',
				value: Formatters.codeBlock((error as string).toString().substring(0, 1014), 'fix'),
			})
			.setTitle('❌ Evaluation Failed');
		interaction.editReply({ embeds: [embed] });
	}
}
