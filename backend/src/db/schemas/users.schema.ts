import { relations, sql } from "drizzle-orm";
import {
    AnyPgColumn,
    integer,
    jsonb,
    pgTable,
    varchar,
    timestamp,
    pgEnum,
    bigint,
    boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const statusEnum = pgEnum("status", ["active", "suspended", "banned"]);

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    telegramId: bigint({ mode: "number" }).unique(),
    firstName: varchar({ length: 255 }),
    lastName: varchar({ length: 255 }),
    username: varchar({ length: 255 }),
    email: varchar({ length: 255 }).unique(),
    apiKey: varchar({ length: 255 }),
    invitedBy: integer().references((): AnyPgColumn => users.id),
    totalInvites: integer().default(0),
    status: statusEnum().default("active"),
    isAdmin: boolean().default(false),
    meta: jsonb(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(() => sql`now()`),
});

export const usersRelations = relations(users, ({ one }) => ({
    invitee: one(users, {
        fields: [users.invitedBy],
        references: [users.id],
    }),
}));

export const userSchema = createSelectSchema(users).omit({
    apiKey: true,
});

export const createUserSchema = createInsertSchema(users);
