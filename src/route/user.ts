import { Elysia } from "elysia";
import z from "zod";
import { getAllUsers } from "@/service/users";
import { betterAuth } from "@/macro/betterAuth";

export const userRoutes = new Elysia({ name: "user-routes" })
  .use(betterAuth)
  .get(
    "/users",
    async ({ user, set }) => {
      if (user.role !== "admin") {
        set.status = 403;
        throw new Error("Unauthorized");
      }

      const users = await getAllUsers();

      return users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }));
    },
    {
      needsAuth: true,
      response: z.array(
        z.object({
          id: z.string(),
          createdAt: z.iso.datetime(),
          updatedAt: z.iso.datetime(),
          email: z.string(),
          emailVerified: z.boolean(),
          name: z.string(),
          role: z.string(),
          image: z.string().nullable().optional(),
        }),
      ),
    },
  );
