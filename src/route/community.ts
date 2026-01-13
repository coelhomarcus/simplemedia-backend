import { Elysia } from "elysia";
import z from "zod";
import { createPost, deletePost, updatePost } from "@/service/community";
import { betterAuth } from "@/macro/betterAuth";

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
  )
  .put(
    "/post/:id",
    async ({ user, params, body, set }) => {
      const postId = Number(params.id);

      if (!postId || isNaN(postId)) {
        set.status = 400;
        return {
          message: "Invalid post ID",
        };
      }

      const [result] = await updatePost(postId, user.id, body);

      return {
        message: "success",
        data: {
          title: result.title,
          content: result.content,
          tags: result.tags,
          imgs: result.imgs,
        },
      };
    },
    {
      needsAuth: true,
      params: z.object({
        id: z.string().describe("Post ID"),
      }),
      body: z.object({
        title: z.string().min(2).max(100).describe("Title").optional(),
        content: z.string().min(2).max(1000).describe("Content").optional(),
        tags: z.string().array().optional().describe("Tags (Array)"),
        imgs: z.string().array().optional().describe("imgs (Array)"),
      }),
      response: {
        200: z.object({
          message: z.string().describe("Message"),
          data: z.object({
            title: z.string().describe("Title"),
            content: z.string().describe("Content"),
            tags: z.string().array().describe("Tags (Array)"),
            imgs: z.string().array().describe("imgs (Array)"),
          }),
        }),
        400: z.object({
          message: z.string().describe("Message"),
        }),
      },
    },
  );
