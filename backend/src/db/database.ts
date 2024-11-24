import { Environment } from "@/libs/types";
import { drizzle, NeonClient, NeonDatabase } from "drizzle-orm/neon-serverless";
import { drizzle as DrizzleNeonHttp } from "drizzle-orm/neon-http";
import { schema } from "./schema";

export function database(Env: Environment, useNeonHttp: boolean = false) {
    if (Env.APP_ENV === "test" || useNeonHttp) {
        return DrizzleNeonHttp(Env.DATABASE_URL, {
            schema,
            casing: "snake_case",
        });
    }

    return drizzle(Env.DATABASE_URL, {
        schema,
        casing: "snake_case",
    });
}

export type DatabaseType = NeonDatabase<typeof schema> & {
    $client: NeonClient;
};
