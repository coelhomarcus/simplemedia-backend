import { media, episode } from "@/database/schema";
import { db } from "@/database/db";
import { eq, count } from "drizzle-orm";

interface createMediaParams {
  name: string;
  sinopse: string;
  tags?: string[];
  coverUrl?: string | null;
  bannerUrl?: string | null;
  isMovie?: boolean;
}

interface createMediaEpisodeParams {
  name: string;
  episodeNumber: number;
  thumbnailUrl?: string | null;
  streamUrl: string;
  subtitleUrl?: string | null;
}

export const createMedia = async ({
  name,
  sinopse,
  tags,
  coverUrl,
  bannerUrl,
  isMovie,
}: createMediaParams) => {
  const newMedia = await db
    .insert(media)
    .values({
      name,
      sinopse,
      tags: tags || null,
      coverUrl: coverUrl || null,
      bannerUrl: bannerUrl || null,
      isMovie: isMovie || false,
    })
    .returning();

  return newMedia;
};

export const createMediaEpisode = async (
  {
    name,
    episodeNumber,
    thumbnailUrl,
    streamUrl,
    subtitleUrl,
  }: createMediaEpisodeParams,
  mediaId: number,
) => {
  const newEpisode = await db
    .insert(episode)
    .values({
      name,
      mediaId,
      episodeNumber,
      thumbnailUrl: thumbnailUrl || null,
      streamUrl,
      subtitleUrl: subtitleUrl || null,
    })
    .returning();

  return newEpisode;
};

export const getMediaById = async (id: number) => {
  const rows = await db
    .select({
      media,
      episode,
    })
    .from(media)
    .innerJoin(episode, eq(media.id, episode.mediaId))
    .where(eq(media.id, id));

  if (rows.length === 0) return null;

  return {
    ...rows[0].media,
    episodes: rows.map((r) => r.episode),
  };
};

export const getAllMedias = async () => {
  const medias = await db.select().from(media);

  const episodesCount = await db
    .select({
      mediaId: episode.mediaId,
      count: count(),
    })
    .from(episode)
    .groupBy(episode.mediaId);

  const countMap = new Map(episodesCount.map((e) => [e.mediaId, e.count]));

  return medias.map((m) => ({
    ...m,
    episodesQuantity: countMap.get(m.id) ?? 0,
  }));
};

export const deleteMediaById = async (id: number) => {
  const [deletedMedia] = await db
    .delete(media)
    .where(eq(media.id, id))
    .returning();

  if (!deletedMedia) {
    throw new Error("Media not found");
  }

  return `Media id:${deletedMedia.id}, name:${deletedMedia.name} deleted successfully`;
};
