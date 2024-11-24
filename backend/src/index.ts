import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routes/router";
import { cors } from "hono/cors";
import { database, DatabaseType } from "./db/database";
import { AppBindings, TrpcContext } from "./libs/types";
import {
    AuthorizeTelegramRequest,
    getTelegramUser,
} from "./libs/telegram-helpers";
import { UserRepository } from "./db/repositories/UserRepository";

const app = new Hono<AppBindings>();

app.get("/", (c) => {
    return c.json({ message: "Internal Error" }, 500);
});

app.use("/trpc/*", cors());

app.use(
    "/trpc/*",
    trpcServer({
        router: appRouter,
        async createContext(opts, c): Promise<TrpcContext> {
            const db = database(c.env) as DatabaseType;

            const token = c.req.header("Authorization")?.split(" ")[1];
            const authorized = token
                ? await AuthorizeTelegramRequest(token, c.env.API_TOKEN)
                : false;

            let telegramUser = undefined;
            let userRepository = new UserRepository(db);
            if (authorized) {
                telegramUser = getTelegramUser(token!)!;
                await userRepository.getOrCreateUsingTelegramUser(telegramUser);
            }

            return {
                env: c.env,
                db,
                authorized,
                telegramUser,
                userRepository,
            };
        },
    })
);

export default app;
