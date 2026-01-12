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
