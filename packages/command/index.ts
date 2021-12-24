import { ApplicationCommandOptionData, ApplicationCommandSubGroup, AutocompleteInteraction, ChatInputApplicationCommandData, CommandInteraction, ContextMenuInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";

export interface CommandOptions extends ChatInputApplicationCommandData {
    execute(interaction: CommandInteraction): any
    complete?(interaction: AutocompleteInteraction): any
    menu?(interaction: ContextMenuInteraction): any
}

export interface SubCommandGroupOptions extends ApplicationCommandSubGroup {
    execute(interaction: CommandInteraction): any
    complete?(interaction: AutocompleteInteraction): any
    menu?(interaction: ContextMenuInteraction): any
}

export class Command implements CommandOptions {

    name: string;
    description: string;
    defaultPermission?: boolean;
    type?: "CHAT_INPUT" | ApplicationCommandTypes.CHAT_INPUT;
    options?: ApplicationCommandOptionData[];
    execute: (interaction: CommandInteraction) => any;
    complete?: (interaction: AutocompleteInteraction) => any;
    menu?: (interaction: ContextMenuInteraction) => any;

    constructor(options: CommandOptions) {
        this.name = options.name;
        this.description = options.description;
        this.defaultPermission = options.defaultPermission;
        this.type = options.type;
        this.options = options.options;
        this.execute = options.execute;
        this.complete = options.complete;
        this.menu = options.menu;
    }
}

export class SubCommandGroup {

}

export class SubCommand {
    
}