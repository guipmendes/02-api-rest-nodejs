import { config as conf } from 'dotenv';
import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

if (process.env.NODE_ENV === "test") {
    conf({ path: ".env.test" });
  } else {
    conf();
  }

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    }
}

export const knex = setupKnex(config)