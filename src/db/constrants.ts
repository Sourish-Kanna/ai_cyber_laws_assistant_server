import Knex, { Knex as KnexType } from "knex";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

const knex: KnexType = Knex({
    client: "postgresql",
    connection: {
        host: process.env.DB_HOST as string,
        user: process.env.DB_USER as string,
        database: process.env.DB_NAME as string,
        password: process.env.DB_PASSWORD as string,
        port: Number(process.env.DB_PORT) || 3306,
        timezone: "utc",
        // host: process.env.DB_HOST as string,
        // user: process.env.DB_USER as string,
        // database: process.env.DB_NAME as string,
        // password: "suthakar,,,",
        // port: 5432,
        // timezone: "utc",
        ssl: { rejectUnauthorized: false },
    },
});

export function knexDb(DB_NAME: string): KnexType {
    return Knex({
        client: "postgresql",
        connection: {
            host: process.env.DB_HOST as string,
            user: process.env.DB_USER as string,
            database: DB_NAME,
            password: process.env.DB_PASSWORD as string,
            port: Number(process.env.DB_PORT) || 3306,
            timezone: "utc",
            // host: process.env.DB_HOST as string,
            // user: process.env.DB_USER as string,
            // database: DB_NAME,
            // password: "suthakar,,,",
            // port: 5432,
            // timezone: "utc",
            ssl: { rejectUnauthorized: false },
        },
        
    });
}

export default knex;
