import { ApplicationCommandOptionData, ApplicationCommandSubGroup, AutocompleteInteraction, ChatInputApplicationCommandData, CommandInteraction, ContextMenuInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
export interface CommandOptions extends ChatInputApplicationCommandData {
    execute(interaction: CommandInteraction): any;
    complete?(interaction: AutocompleteInteraction): any;
    menu?(interaction: ContextMenuInteraction): any;
}
export interface SubCommandGroupOptions extends ApplicationCommandSubGroup {
    execute(interaction: CommandInteraction): any;
    complete?(interaction: AutocompleteInteraction): any;
    menu?(interaction: ContextMenuInteraction): any;
}
export declare class Command implements CommandOptions {
    name: string;
    description: string;
    defaultPermission?: boolean;
    type?: "CHAT_INPUT" | ApplicationCommandTypes.CHAT_INPUT;
    options?: ApplicationCommandOptionData[];
    execute: (interaction: CommandInteraction) => any;
    complete?: (interaction: AutocompleteInteraction) => any;
    menu?: (interaction: ContextMenuInteraction) => any;
    constructor(options: CommandOptions);
}
export declare class SubCommandGroup {
}
export declare class SubCommand {
}
