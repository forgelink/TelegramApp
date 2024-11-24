import { DatabaseType } from "@/db/database";
import { Hono } from "hono";
import { users, userSchema } from "@/db/schemas/users.schema";
import { z } from "zod";
import { UserRepository } from "@/db/repositories/UserRepository";

export type Environment = {
    APP_ENV: string | undefined;
    DATABASE_URL: string;
    API_TOKEN: string;
};

export type AppBindings = {
    Bindings: Environment;
    Variables: {
        db: DatabaseType;
        user: z.infer<typeof userSchema>;
    };
};

export type TrpcContext = {
    env: Environment;
    db: DatabaseType;
    authorized: boolean;
    telegramUser: WebAppUser | undefined;
    userRepository: UserRepository
};

export type HonoApp = Hono<AppBindings>;
