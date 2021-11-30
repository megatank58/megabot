import { Collection, ApplicationCommand, CommandInteraction, AutocompleteInteraction, Message } from 'discord.js';

declare module 'discord.js' {
	// eslint-disable-next-line
	interface Client {
		_commands: Collection<
			string,
			ApplicationCommand & {
				ephemeral: boolean;
				execute: (interaction: CommandInteraction) => any;
				complete: (interaction: AutocompleteInteraction) => any;
			}
		>;
	}
	interface GuildMember {
		messages: Message[];
	}
}