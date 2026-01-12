type CreatePostData = {
  title: string;
  content: string;
  tags?: string[];
  imgs?: string[];
};

import { db } from "@/database/db";
import * as schema from "@/database/schema";

export const createPost = async (
  userId: string,
  { title, content, tags, imgs }: CreatePostData,
) => {
  if (!userId || !title || !content) {
    throw new Error("Missing required fields");
  }

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
