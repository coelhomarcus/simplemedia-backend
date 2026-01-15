import { Elysia } from "elysia";
import { betterAuth } from "@/macro/betterAuth";
import {
  createMedia,
  createMediaEpisode,
  getMediaById,
  getAllMedias,
  deleteMediaById,
} from "@/service/medias.services";
import {
  CreateMediaSchema,
  CreateMediaEpisodeSchema,
  GetMediaByIdSchema,
  GetAllMediaSchema,
  DeleteMediaByIdSchema,
} from "@/schema/media.schema";
import z from "zod";

export const mediaRoutes = new Elysia({ name: "media-routes" })
  .use(betterAuth)
  .get(
    "/medias",
    async ({ set }) => {
      const medias = await getAllMedias();

      if (!medias) {
        set.status = 404;
        throw new Error("Medias not found");
      }

      return medias;
    },
    {
      needsAuth: true,
      response: GetAllMediaSchema.responseSuccess,
    },
  )
  .get(
    "/media/:mediaId",
    async ({ params, set }) => {
      const id = Number(params.mediaId);

      if (isNaN(id)) {
        set.status = 400;
        throw new Error("Invalid media id");
      }

      const media = await getMediaById(id);

      if (!media) {
        set.status = 404;
        throw new Error("Media not found");
      }

      return media;
    },
    {
      needsAuth: true,
      params: GetMediaByIdSchema.params,
      response: GetMediaByIdSchema.responseSuccess,
    },
  )
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
  )
  .delete(
    "/media/delete/:mediaId",
    async ({ params, set, user }) => {
      if (user.role !== "admin") {
        set.status = 403;
        throw new Error("Unauthorized");
      }

      const id = Number(params.mediaId);

      if (isNaN(id)) {
        set.status = 400;
        throw new Error("Invalid media id");
      }

      const response = await deleteMediaById(id);

      if (!response) {
        throw new Error("Failed to delete media");
      }

      return {
        message: response,
      };
    },
    {
      needsAuth: true,
      params: DeleteMediaByIdSchema.params,
      response: DeleteMediaByIdSchema.responseSuccess,
    },
  );
