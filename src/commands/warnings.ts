import { CommandInteraction, ApplicationCommandData, GuildMember, MessageEmbed, Constants } from 'discord.js';
import fetch from 'node-fetch';

export default {
	name: 'warnings',
	description: 'See the warnings of member',
	options: [
		{
			name: 'member',
			description: 'The warnings of the member to see',
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		},
	],
	default_permission: false,
	async execute(interaction: CommandInteraction) {
		const member = interaction.options.getMember('member');
		if (!member || !(member instanceof GuildMember)) return;

		const embed = new MessageEmbed();

		const body = {
			secret: process.env.SECRET,
			db: 'warns',
			key: member.id,
		};

		const data = await fetch('https://database.bloxdatabase.repl.co/get', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});

		const json = await data.json().catch(() => null);

		if (!json || json.length == 0) {
			embed.setDescription('No warnings.');
			embed.setColor('BLUE');

			return interaction.editReply({
				embeds: [embed],
			});
		}

		for (const warn of json) {
			if (embed.fields.length < 24) {
				embed.addField(`ID: ${warn.id} | Moderator: ${warn.moderator}`, `Reason: ${warn.reason}`);
			}
		}

		embed.setAuthor(member.displayName, member.displayAvatarURL()).setColor('RED');

		interaction.editReply({
			embeds: [embed],
		});
	},
} as ApplicationCommandData;
