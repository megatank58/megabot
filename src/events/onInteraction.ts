import { Interaction } from 'discord.js';

export default {
	name: 'interactionCreate',
	async execute(interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client._commands.get(interaction.commandName);

		if (!command) return;

		await interaction.deferReply();

		const args: any = {};

		if (command.options) {
			command.options.forEach((option: any) => {
				if (option.options) {
					option.options.forEach((opt: any) => {
						const type = opt.type;
						let optionValue: any = interaction.options.get(opt.name);
						if (!optionValue) return;
						if (type === 'USER') {
							optionValue = interaction.options.getMember(opt.name);
						} else {
							optionValue = optionValue.value;
						}
						args[opt.name] = optionValue;
					});
				}
				const type = option.type;
				let optionValue: any = interaction.options.get(option.name);
				if (!optionValue) return;
				if (type === 'USER') {
					optionValue = interaction.options.getMember(option.name);
				} else {
					optionValue = optionValue.value;
				}
				args[option.name] = optionValue;
			});
			const subcommand = interaction.options.getSubcommand(false);
			if (subcommand) args.subcommand = subcommand;
		}

		try {
			command?.execute(interaction, args);
		} catch (err) {
			console.error(err);
		} finally {
			interaction.client.emit('debug', '[WS => CommandInteraction] Replied successfully');
		}
	},
};
