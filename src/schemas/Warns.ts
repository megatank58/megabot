import { Snowflake } from 'discord.js';
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

export class Warn {
    @Column()
    id: string;

    @Column()
    reason?: string;

    @Column()
    moderator: Snowflake;
}

@Entity()
export class Warnings {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    guild: Snowflake;

    @Column()
    member: Snowflake;

    @Column()
    warns: Warn[]

}