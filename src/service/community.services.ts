type CreatePostData = {
  title: string;
  content: string;
  tags?: string[];
  imgs?: string[];
};

type UpdatePostData = {
  title?: string;
  content?: string;
  tags?: string[];
  imgs?: string[];
};

import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

export const createPost = async (
  userId: string,
  { title, content, tags, imgs }: CreatePostData,
) => {
  const [newPost] = await db
    .insert(schema.postTable)
    .values({
      userId,
      title,
      content,
      tags: tags ?? [],
      imgs: imgs ?? [],
    })
    .returning();

  return newPost;
};

export const getAllPosts = async () => {
  const posts = await db
    .select({
      id: schema.postTable.id,
      title: schema.postTable.title,
      content: schema.postTable.content,
      tags: schema.postTable.tags,
      imgs: schema.postTable.imgs,

      user: {
        name: schema.user.username,
        username: schema.user.username,
        image: schema.user.image,
      },
    })
    .from(schema.postTable)
    .innerJoin(schema.user, eq(schema.postTable.userId, schema.user.id));

  return posts;
};

export const getUserPosts = async (username: string) => {
  const posts = await db
    .select({
      id: schema.postTable.id,
      title: schema.postTable.title,
      content: schema.postTable.content,
      tags: schema.postTable.tags,
      imgs: schema.postTable.imgs,

      user: {
        name: schema.user.username,
        username: schema.user.username,
        image: schema.user.image,
      },
    })
    .from(schema.postTable)
    .innerJoin(schema.user, eq(schema.postTable.userId, schema.user.id));

  if (posts.length === 0) {
    throw new Error("No posts found");
  }

  return posts;
};

export const getPostById = async (id: number) => {
  const [post] = await db
    .select({
      id: schema.postTable.id,
      userId: schema.postTable.userId,
      title: schema.postTable.title,
      content: schema.postTable.content,
      tags: schema.postTable.tags,
      imgs: schema.postTable.imgs,

      user: {
        name: schema.user.name,
        username: schema.user.username,
        image: schema.user.image,
      },
    })
    .from(schema.postTable)
    .where(eq(schema.postTable.id, id))
    .innerJoin(schema.user, eq(schema.postTable.userId, schema.user.id));

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

export const deletePost = async (postId: number, userId: string) => {
  const [post] = await db
    .select()
    .from(schema.postTable)
    .where(eq(schema.postTable.id, postId));

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .delete(schema.postTable)
    .where(eq(schema.postTable.id, postId))
    .returning();

  return result;
};

export const updatePost = async (
  postId: number,
  userId: string,
  { title, content, tags, imgs }: UpdatePostData,
) => {
  const [post] = await db
    .select()
    .from(schema.postTable)
    .where(eq(schema.postTable.id, postId));

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .update(schema.postTable)
    .set({
      title: title ?? post.title,
      content: content ?? post.content,
      tags: tags ?? post.tags,
      imgs: imgs ?? post.tags,
    })
    .where(eq(schema.postTable.id, postId))
    .returning();

  return result;
};
