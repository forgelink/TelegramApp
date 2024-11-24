import { TrpcContext } from "@/libs/types";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";


const t = initTRPC.context<TrpcContext>().create();

export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(async (opts) => {
    if (!opts.ctx.authorized) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next();
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;