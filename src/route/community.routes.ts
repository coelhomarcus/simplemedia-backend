import { Elysia } from "elysia";
import z from "zod";
import {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  getPostById,
  getAllPosts,
} from "@/service/community.services";
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
  .get(
    "posts",
    async () => {
      const posts = await getAllPosts();

      return {
        message: "success",
        posts,
      };
    },
    {
      response: {
        200: z.object({
          message: z.string().describe("Message"),
          posts: z.array(
            z.object({
              id: z.number().int().describe("Post ID"),
              title: z.string().min(2).max(100).describe("Title"),
              content: z.string().min(2).max(1000).describe("Content"),
              tags: z.array(z.string()).optional().describe("Tags"),
              imgs: z.array(z.string()).optional().describe("Imgs"),
              user: z.object({
                name: z.string().describe("User Name"),
                username: z.string().describe("Username"),
                image: z.string().nullable().describe("User Image"),
              }),
            }),
          ),
        }),
      },
    },
  )
  .get(
    "post/:postId",
    async ({ params }) => {
      const id = parseInt(params.postId);

      const post = await getPostById(id);

      return {
        message: "success",
        post,
      };
    },
    {
      needsAuth: true,
      params: z.object({
        postId: z.string().describe("Post ID"),
      }),
      response: {
        200: z.object({
          message: z.string().describe("Message"),
          post: z.object({
            id: z.number().int().describe("Post ID"),
            title: z.string().min(2).max(100).describe("Title"),
            content: z.string().min(2).max(1000).describe("Content"),
            tags: z.array(z.string()).optional().describe("Tags"),
            imgs: z.array(z.string()).optional().describe("Imgs"),
            user: z.object({
              name: z.string().describe("User Name"),
              username: z.string().describe("Username"),
              image: z.string().nullable().describe("User Image"),
            }),
          }),
        }),
      },
    },
  )
  .get(
    "posts/:username",
    async ({ params }) => {
      const username = params.username;

      const posts = await getUserPosts(username);

      return {
        message: "success",
        data: posts,
      };
    },
    {
      needsAuth: true,
      params: z.object({
        username: z.string().describe("Username"),
      }),
      response: {
        200: z.object({
          message: z.string().describe("Message"),
          data: z.array(
            z.object({
              id: z.int().describe("Post ID"),
              title: z.string().min(2).max(100).describe("Title"),
              content: z.string().min(2).max(1000).describe("Content"),
              tags: z.string().array().optional().describe("Tags (Array)"),
              imgs: z.string().array().optional().describe("imgs (Array)"),
              user: z.object({
                name: z.string().describe("User Name"),
                username: z.string().describe("User Username"),
                image: z.string().nullable().describe("User Image"),
              }),
            }),
          ),
        }),
      },
    },
  )
  .delete(
    "/post/delete/:postId",
    async ({ user, params }) => {
      const postId = Number(params.postId);

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
        postId: z.string().describe("Post ID"),
      }),
      response: {
        200: z.object({
          message: z.string().describe("Message"),
        }),
      },
    },
  )
  .post(
    "/post/update/:postId",
    async ({ user, params, body, set }) => {
      const postId = Number(params.postId);

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
        postId: z.string().describe("Post ID"),
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
