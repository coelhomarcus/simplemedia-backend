import { Elysia } from "elysia";
import z from "zod";
import { createPost, deletePost } from "@/service/post";
import { betterAuth } from "@/macro/betterAuth";
import { string } from "zod/v4/core/regexes.cjs";

export const communityRoutes = new Elysia({ name: "community-routes" })
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
  .delete(
    "/post/:id",
    async ({ user, params }) => {
      const postId = Number(params.id);

      if (!postId || isNaN(postId)) {
        return {
          message: "Invalid post ID",
        };
      }

      const result = await deletePost(postId, user.id);

      return {
        message: "success",
      };
    },
    {
      needsAuth: true,
      params: z.object({
        id: z.string().describe("Post ID"),
      }),
      response: {
        200: z.object({
          message: z.string().describe("Message"),
        }),
      },
    },
  );
