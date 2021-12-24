import { Client, Intents, Options, Collection } from 'discord.js';
import { register } from './register';

declare module 'discord.js' {
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
}

export class Megabot extends Client {
	constructor() {
		super({
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
			allowedMentions: { repliedUser: true },
			failIfNotExists: false,
			presence: {
				activities: [
					{
						name: 'with a dog!',
						type: 'PLAYING',
						url: 'https://megabot.rocks',
					},
				],
				status: 'idle',
			},
			makeCache: Options.cacheWithLimits({
				GuildMemberManager: 10,
				MessageManager: 100,
				UserManager: 10,
				PresenceManager: 0,
			}),
		});

        register(this);
        
		this.login();
	}
}
