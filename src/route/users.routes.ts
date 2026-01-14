import { Elysia } from "elysia";
import { getAllUsers, getUserById } from "@/service/users.services";
import { betterAuth } from "@/macro/betterAuth";
import { GetAllUsersSchema, GetUserByIdSchema } from "@/schema/users.schema";

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
      response: GetAllUsersSchema.response,
    },
  )
  .get(
    "/user/:id",
    async ({ params, user }) => {
      if (user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const result = await getUserById(params.id);

      if (!result) {
        throw new Error("User not found");
      }

      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    },
    {
      needsAuth: true,
      params: GetUserByIdSchema.params,
      response: GetUserByIdSchema.response,
    },
  );
