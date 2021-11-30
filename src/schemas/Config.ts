import { Snowflake } from 'discord.js';
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

export class Roles {
    @Column()
    mute: Snowflake
}

@Entity()
export class Config {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    guild: Snowflake;

    @Column()
    logChannel: Snowflake;

    @Column()
    roles: Roles

}