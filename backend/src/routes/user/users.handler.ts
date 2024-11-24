import { z } from "zod";
import { router, authProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { database } from "@/db/database";

export const usersRouter = router({
    me: authProcedure.query(async ({ ctx: { userRepository } }) => {
        const user = userRepository.user;

        return user;
    }),
});
