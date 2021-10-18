import { CommandInteraction, ApplicationCommandData, Constants } from 'discord.js';

export default {
	name: 'permission',
	description: 'Set the permission for a command',
	options: [
		{
			name: 'command',
			description: 'The command to set permission',
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		},
		{
			name: 'query',
			description: 'The member or role to set permission for',
			type: Constants.ApplicationCommandOptionTypes.MENTIONABLE,
			required: true,
		},
		{
			name: 'type',
			description: 'The command to set permission for',
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
			choices: [
				{
					name: 'User',
					value: 'USER',
				},
				{
					name: 'Role',
					value: 'ROLE',
				},
			],
		},
		{
			name: 'permission',
			description: 'The to set permission',
			type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
			required: true,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		await interaction.guild?.commands.fetch();

		const command = interaction.guild?.commands.cache.find(
			(cmd) => cmd.name === interaction.options.getString('command')!,
		);
		const query = interaction.options.getMentionable('query')!;
		const type = interaction.options.getString('type');
		const permission = interaction.options.getBoolean('permission')!;

		if (type !== 'USER' && type !== 'ROLE') return;
		if (!command) return interaction.editReply('Command not found');

		interaction.guild?.commands.permissions.add({
			command: command.id,
			permissions: [
				{
					// @ts-expect-error Query will always be present and a role or user
					id: query.id,
					type,
					permission,
				},
			],
		});
		interaction.editReply(`Permission setted successfully for ${command.name} command for ${query} ${type.toLowerCase()} as ${permission}`);
	},
} as ApplicationCommandData;
