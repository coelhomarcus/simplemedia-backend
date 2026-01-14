import { z } from "zod";

export const CreatePostSchema = {
  body: z.object({
    title: z.string().min(2).max(100).describe("Title"),
    content: z.string().min(2).max(1000).describe("Content"),
    tags: z.string().array().optional().describe("Tags (Array)"),
    imgs: z.string().array().optional().describe("imgs (Array)"),
  }),
  responseSuccess: z.object({
    message: z.string().describe("Message"),
    data: z.object({
      userId: z.uuid().describe("User ID"),
      title: z.string().min(2).max(100).describe("Title"),
      content: z.string().min(2).max(1000).describe("Content"),
      tags: z.string().array().optional().describe("Tags (Array)"),
      imgs: z.string().array().optional().describe("imgs (Array)"),
    }),
  }),
};

export const GetAllPostSchema = {
  responseSuccess: z.object({
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
};

export const GetPostByIdSchema = {
  params: z.object({
    postId: z.string().describe("Post ID"),
  }),
  responseSuccess: z.object({
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
};

export const GetPostsByUserSchema = {
  params: z.object({
    username: z.string().describe("Username"),
  }),
  responseSuccess: z.object({
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
};

export const DeletePostSchema = {
  params: z.object({
    postId: z.string().describe("Post ID"),
  }),
  responseSuccess: z.object({
    message: z.string().describe("Message"),
  }),
};

export const UpdatePostSchema = {
  params: z.object({
    postId: z.string().describe("Post ID"),
  }),
  body: z.object({
    title: z.string().min(2).max(100).describe("Title").optional(),
    content: z.string().min(2).max(1000).describe("Content").optional(),
    tags: z.string().array().optional().describe("Tags (Array)"),
    imgs: z.string().array().optional().describe("imgs (Array)"),
  }),
  responseSuccess: z.object({
    message: z.string().describe("Message"),
    data: z.object({
      title: z.string().describe("Title"),
      content: z.string().describe("Content"),
      tags: z.string().array().describe("Tags (Array)"),
      imgs: z.string().array().describe("imgs (Array)"),
    }),
  }),
  responseError: z.object({
    message: z.string().describe("Message"),
  }),
};
