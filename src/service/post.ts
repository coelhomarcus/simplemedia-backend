type CreatePostData = {
  title: string;
  content: string;
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

export const deletePost = async (id: number, userId: string) => {
  const [post] = await db
    .select()
    .from(schema.postTable)
    .where(eq(schema.postTable.id, id));

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .delete(schema.postTable)
    .where(eq(schema.postTable.id, id))
    .returning();

  return result;
};
