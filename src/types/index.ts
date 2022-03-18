import { Collection } from 'discord.js';
import { main } from '../deploy-commands';

declare module 'discord.js' {
	interface Client {
		_commands: Collection<
			string,
			{
				name: string;
				guild_only: boolean;
				ephemeral: boolean;
				run?: (interaction: CommandInteraction) => any;
				complete?: (interaction: AutocompleteInteraction) => any;
				menu?: (interaction: ContextMenuCommandInteraction) => any;
			}
		>;
		_deploy: typeof main
	}
}
