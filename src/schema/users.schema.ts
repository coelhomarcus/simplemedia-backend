import { z } from "zod";

export const GetAllUsersSchema = {
  response: z.array(
    z.object({
      id: z.string(),
      createdAt: z.iso.datetime(),
      updatedAt: z.iso.datetime(),
      email: z.string(),
      emailVerified: z.boolean(),
      name: z.string(),
      username: z.string(),
      role: z.string(),
      image: z.string().nullable().optional(),
    }),
  ),
};

export const GetUserByIdSchema = {
  params: z.object({
    id: z.uuid(),
  }),
  response: z.object({
    id: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    email: z.string(),
    emailVerified: z.boolean(),
    name: z.string(),
    username: z.string(),
    role: z.string(),
    image: z.string().nullable().optional(),
  }),
};
