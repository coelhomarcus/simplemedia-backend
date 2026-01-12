import { Elysia } from "elysia";
import z from "zod";
import { createPost } from "@/service/post";
import { betterAuth } from "@/macro/betterAuth";

export const testRoutes = new Elysia({ name: "test-routes" })
  .use(betterAuth)
  .post(
    "/post",
    async ({ body, user }) => {
      const newPost = await createPost(user.id, body);

      return {
        message: "success",
        data: newPost,
      };
    },
    {
      needsAuth: true,
      body: z.object({
        title: z.string().min(2).max(100).describe("Title"),
        content: z.string().min(2).max(1000).describe("Content"),
        tags: z.string().array().optional().describe("Tags (Array)"),
        imgs: z.string().array().optional().describe("imgs (Array)"),
      }),
      response: {
        200: z.object({
          message: z.string().describe("Message"),
          data: z.object({
            userId: z.uuid().describe("User ID"),
            title: z.string().min(2).max(100).describe("Title"),
            content: z.string().min(2).max(1000).describe("Content"),
            tags: z.string().array().optional().describe("Tags (Array)"),
            imgs: z.string().array().optional().describe("imgs (Array)"),
          }),
        }),
      },
    },
  )

  .get(
    "/",
    () => {
      return "Hello API!";
    },
    {
      needsAuth: true, //apenas teste de autenticação
      response: {
        200: z.string().describe("Hello Elysia"),
      },
    },
  );
