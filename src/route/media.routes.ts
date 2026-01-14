import { Elysia } from "elysia";
import { betterAuth } from "@/macro/betterAuth";
import { createMedia, createMediaEpisode } from "@/service/medias.services";
import {
  CreateMediaSchema,
  CreateMediaEpisodeSchema,
} from "@/schema/media.schema";

export const mediaRoutes = new Elysia({ name: "media-routes" })
  .use(betterAuth)
  .post(
    "media/create",
    async ({ body, user, set }) => {
      if (user.role !== "admin") {
        set.status = 403;
        throw new Error("Unauthorized");
      }

      const [media] = await createMedia({
        name: body.name,
        sinopse: body.sinopse,
        tags: body.tags,
        coverUrl: body.coverUrl,
        bannerUrl: body.bannerUrl,
        isMovie: body.isMovie,
      });

      return {
        message: "success",
        media: {
          id: media.id,
          name: media.name,
          sinopse: media.sinopse,
          tags: media.tags,
          coverUrl: media.coverUrl,
          bannerUrl: media.bannerUrl,
          isMovie: media.isMovie,
          updatedAt: media.updatedAt,
          createdAt: media.createdAt,
        },
      };
    },
    {
      needsAuth: true,
      body: CreateMediaSchema.body,
      response: CreateMediaSchema.response,
    },
  )
  .post(
    "media/episode/create",
    async ({ body, user, set }) => {
      if (user.role !== "admin") {
        set.status = 403;
        throw new Error("Unauthorized");
      }

      try {
        const [episode] = await createMediaEpisode(
          {
            name: body.name,
            episodeNumber: body.episodeNumber,
            thumbnailUrl: body.thumbnailUrl,
            streamUrl: body.streamUrl,
            subtitleUrl: body.subtitleUrl,
          },
          body.mediaId,
        );

        return {
          message: "success",
          episode: {
            id: episode.id,
            name: episode.name,
            episodeNumber: episode.episodeNumber,
            thumbnailUrl: episode.thumbnailUrl,
            streamUrl: episode.streamUrl,
            subtitleUrl: episode.subtitleUrl,
            updatedAt: episode.updatedAt.toISOString(),
            createdAt: episode.createdAt.toISOString(),
          },
        };
      } catch (error) {
        set.status = 500;

        if (error instanceof Error) {
          return {
            message: "error",
            error: error.message,
          };
        }

        return {
          message: "error",
          error: "Unknown error",
        };
      }
    },
    {
      needsAuth: true,
      body: CreateMediaEpisodeSchema.body,
      response: {
        200: CreateMediaEpisodeSchema.responseSuccess,
        500: CreateMediaEpisodeSchema.responseError,
      },
    },
  );
