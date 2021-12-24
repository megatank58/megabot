export interface EventOptions {
    name: string;
    once?: boolean;
    execute(...args: any): any;
}
export declare class Event {
    name: string;
    once?: boolean;
    execute: (...args: any) => any;
    constructor(options: EventOptions);
}
