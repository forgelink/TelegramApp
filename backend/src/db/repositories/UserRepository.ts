import { eq } from "drizzle-orm";
import { DatabaseType } from "../database";
import { createUserSchema, users, userSchema } from "../schemas/users.schema";
import { z } from "zod";

export class UserRepository {
    private db: DatabaseType;
    public user: z.infer<typeof userSchema> | undefined;

    constructor(db: DatabaseType) {
        this.db = db;
    }

    async getOrCreateUsingTelegramUser(
        telegramUser: WebAppUser
    ): Promise<z.infer<typeof userSchema>> {
        let user = await this.db.query.users.findFirst({
            where: eq(users.telegramId, telegramUser!.id),
        });

        if (user === undefined) {
            user = await this.create({
                telegramId: telegramUser.id,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
                username: telegramUser.username,
            });
        }

        this.user = userSchema.parse(user);
        return this.user;
    }

    async find(id: number): Promise<z.infer<typeof userSchema>> {
        const user = await this.db.query.users.findFirst({
            where: eq(users.id, id),
        });

        this.user = userSchema.parse(user);
        return this.user;
    }

    async findByTelegramId(telegramId: number): Promise<z.infer<typeof userSchema>> {
        const user = await this.db.query.users.findFirst({
            where: eq(users.telegramId, telegramId),
        });

        this.user = userSchema.parse(user);
        return this.user;
    }

    async create(user: z.infer<typeof createUserSchema>) {
        const [createdUser] = await this.db
            .insert(users)
            .values(user)
            .returning();

        return createdUser;
    }
}
