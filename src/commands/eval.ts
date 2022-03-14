import {
	ContextMenuCommandInteraction,
	EmbedBuilder,
	Formatters,
	MessageAttachment,
} from 'discord.js';
import { ApplicationCommandType } from 'discord-api-types/v9';

export default {
	name: 'Eval',
	type: ApplicationCommandType.Message,
	guildOnly: true,
	defaultPermission: false,
	async execute(interaction: ContextMenuCommandInteraction) {
		const code = interaction.options.getMessage('message')!.content;
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
						.addFields({ name: '📤 Output', value: Formatters.codeBlock(evaled.substring(0, 1015)) })
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
	},
};
