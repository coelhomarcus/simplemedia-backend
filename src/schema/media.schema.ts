import { z } from "zod";

export const CreateMediaSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    sinopse: z.string().min(2).max(500),
    tags: z.string().array().min(1).max(10).optional(),
    coverUrl: z.string().nullable().optional(),
    bannerUrl: z.string().nullable().optional(),
    isMovie: z.boolean().default(false),
  }),
  response: {
    message: z.string().min(2).max(100),
    media: z.object({
      id: z.int(),
      name: z.string().min(2).max(100),
      sinopse: z.string().min(2).max(500),
      tags: z.string().array().min(1).max(10).optional(),
      coverUrl: z.string().nullable().optional(),
      bannerUrl: z.string().nullable().optional(),
      isMovie: z.boolean(),
      updatedAt: z.iso.datetime(),
      createdAt: z.iso.datetime(),
    }),
  },
};

export const CreateMediaEpisodeSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    episodeNumber: z.number().min(1),
    thumbnailUrl: z.string().nullable().optional(),
    streamUrl: z.string(),
    subtitleUrl: z.string().nullable().optional(),
    mediaId: z.number().min(1),
  }),
  responseSuccess: z.object({
    message: z.string(),
    episode: z.object({
      id: z.number().min(1),
      name: z.string().min(2).max(100),
      episodeNumber: z.number().min(1),
      thumbnailUrl: z.string().nullable().optional(),
      streamUrl: z.string(),
      subtitleUrl: z.string().nullable().optional(),
      updatedAt: z.iso.datetime(),
      createdAt: z.iso.datetime(),
    }),
  }),
  responseError: z.object({
    message: z.string(),
    error: z.string(),
  }),
};

export const GetMediaByIdSchema = {
  params: z.object({
    mediaId: z.string(),
  }),
  responseSuccess: z.object({
    id: z.number(),
    name: z.string(),
    sinopse: z.string(),
    tags: z.array(z.string()).nullable(),
    coverUrl: z.string().nullable().optional(),
    bannerUrl: z.string().nullable().optional(),
    isMovie: z.boolean(),
    updatedAt: z.date(),
    createdAt: z.date(),
    episodes: z.array(
      z.object({
        id: z.number(),
        mediaId: z.number(),
        name: z.string(),
        thumbnailUrl: z.string().nullable().optional(),
        streamUrl: z.string(),
        subtitleUrl: z.string().nullable().optional(),
        episodeNumber: z.int(),
        updatedAt: z.date(),
        createdAt: z.date(),
      }),
    ),
  }),
};

export const GetAllMediaSchema = {
  responseSuccess: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      sinopse: z.string(),
      tags: z.array(z.string()).nullable(),
      coverUrl: z.string().nullable(),
      bannerUrl: z.string().nullable(),
      isMovie: z.boolean(),
      episodesQuantity: z.int(),
    }),
  ),
};

export const DeleteMediaByIdSchema = {
  params: z.object({
    mediaId: z.string(),
  }),
  responseSuccess: z.object({ message: z.string().min(1) }),
};
