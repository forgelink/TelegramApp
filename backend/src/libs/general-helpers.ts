import { database, DatabaseType } from "@/db/database";
import { UserRepository } from "@/db/repositories/UserRepository";
import { Environment, TrpcContext } from "@/libs/types";
import { AppRouter } from "@/routes/router";
import { createCallerFactory } from "@/routes/trpc";
import { config } from "dotenv";

export async function mockTrpcContext(authorized: boolean = false): Promise<TrpcContext> {
    config({ path: "./.dev.vars" });

    const db = database({
        ...(process.env as Environment),
        APP_ENV: "test",
    });

    const telegramUser: WebAppUser = {
        id: 66443035,
        first_name: "Mehrab",
        last_name: "",
        username: "mehrab_xyz",
        language_code: "en",
        allows_write_to_pm: true,
        photo_url:
            "https://t.me/i/userpic/320/3t2cGd5zRflIN0nW_UddLm1og4vYBLgMc7I9kN_SJMI.svg",
    };

    const userRepository = new UserRepository(db as DatabaseType);
    await userRepository.findByTelegramId(telegramUser.id);

    return {
        env: {
            APP_ENV: "test",
            DATABASE_URL: process.env.DATABASE_URL as string,
            API_TOKEN: process.env.API_TOKEN as string,
        },
        authorized,
        db: db as DatabaseType,
        telegramUser,
        userRepository,
    };
}

export async function createTrpcCaller(appRouter: AppRouter) {
    const createCaller = createCallerFactory(appRouter);
    const caller = createCaller(await mockTrpcContext(true));

    return caller;
}
