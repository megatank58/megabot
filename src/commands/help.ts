import { CommandInteraction } from 'discord.js';

const help = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Help')
	.setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	.addFields(
		{ name: 'Help', value: 'Displays this message' },
		{ name: 'Ping', value: 'Checks ping with Discord servers'}
		//{ name: '', value: ''},
	)
	.setTimestamp()
	.setFooter('Made by kevlu8 and Megatank58', 'https://i.imgur.com/AfFp7pu.png');

export default {
	name: 'help',
	description: 'Get a list of all commands',
    
	execute(interaction: CommandInteraction) {
		await interaction.reply({embed: [help] });
	},
};

