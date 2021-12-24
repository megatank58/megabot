export interface EventOptions {
    name: string;
    once?: boolean;
    execute(...args: any): any;
}

export class Event {
    name: string;
    once?: boolean;
    execute: (...args: any) => any;

    constructor(options: EventOptions) {
        this.name = options.name;
        this.once = options.once;
        this.execute = options.execute;
    }
}