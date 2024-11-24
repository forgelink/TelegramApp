import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({path: './.dev.vars'});

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schemas",
    dialect: "postgresql",
    casing: "snake_case",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
