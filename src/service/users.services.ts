import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

export const getAllUsers = async () => {
  const users = await db.select().from(schema.user);

  return users;
};

export const getUserById = async (userId: string) => {
  const user = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, userId));

  return [user];
};
