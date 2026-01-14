import { Elysia } from "elysia";
import {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  getPostById,
  getAllPosts,
} from "@/service/community.services";
import { betterAuth } from "@/macro/betterAuth";
import {
  CreatePostSchema,
  DeletePostSchema,
  GetAllPostSchema,
  GetPostByIdSchema,
  GetPostsByUserSchema,
  UpdatePostSchema,
} from "@/schema/community.schema";

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
      body: CreatePostSchema.body,
      response: {
        200: CreatePostSchema.responseSuccess,
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
        200: GetAllPostSchema.responseSuccess,
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
      params: GetPostByIdSchema.params,
      response: {
        200: GetPostByIdSchema.responseSuccess,
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
      params: GetPostsByUserSchema.params,
      response: {
        200: GetPostsByUserSchema.responseSuccess,
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
      params: DeletePostSchema.params,
      response: {
        200: DeletePostSchema.responseSuccess,
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
      params: UpdatePostSchema.params,
      body: UpdatePostSchema.body,
      response: {
        200: UpdatePostSchema.responseSuccess,
        400: UpdatePostSchema.responseError,
      },
    },
  );
