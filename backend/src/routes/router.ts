import { router, publicProcedure, authProcedure } from "./trpc";
import { z } from "zod";
import { usersRouter } from "./user/users.handler";

export const appRouter = router({
    hello: publicProcedure
        .input(z.object({ name: z.string() }))
        .output(z.object({ greeting: z.string() }))
        .query(({ input }) => {
            return { greeting: `Hello ${input.name}!` };
        }),

    users: usersRouter,
});

export type AppRouter = typeof appRouter;
