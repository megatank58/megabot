import { CommandInteraction } from 'discord.js';

var args = msg.content.substr(1).split(/ +/);

export default {
	name: 'slowmode',
	description: 'Set the slowmode of a channel',
	execute(interaction: CommandInteraction) {
    if(args[1] != null){
      try {
        msg.channel.setRateLimitPerUser(args[1]);
        interaction.reply("Set the slowmode successfully.");
      } catch {
        interaction.reply("Something went wrong. It is likely that you misused the command.");
      }
    }
	},
};
