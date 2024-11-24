import { expect, test } from "vitest";
import { appRouter } from "../router";
import { createTrpcCaller } from "@/libs/general-helpers";
import { AuthorizeTelegramRequest } from "@/libs/telegram-helpers";
import { userSchema } from "@/db/schemas/users.schema";

test("Validate WebApp User", async () => {
    const initDataValue =
        "query_id=AAEb1_UDAAAAABvX9QMRQKOG&user=%7B%22id%22%3A66443035%2C%22first_name%22%3A%22Mehrab%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mehrab_xyz%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F3t2cGd5zRflIN0nW_UddLm1og4vYBLgMc7I9kN_SJMI.svg%22%7D&auth_date=1732389908&signature=O8agKpuA3kmJQ4uA5DupWlkjsHyOxWSSVIwmG5S9FeYvc26oRAPM9IAv6kIfp9Rcf0mTVeRXakJ5SySPEfdSCA&hash=7af2f65ea254d6f2adcd5bd8a603bf8419103c4f9d92539b345c1193e28652b6";
    const testToken = "7711520033:AAGL173UWPIm-3qZrMYJCC9gJ-fOTa77Itw";

    const authorized = await AuthorizeTelegramRequest(initDataValue, testToken);

    expect(authorized).toBeTruthy();
});

test("Get or Create users using WebApp Data", async () => {
    const caller = await createTrpcCaller(appRouter);

    const user = await caller.users.me();

    expect(user).toBeDefined();
    expect(user).toMatchObject(userSchema.parse(user));
});
