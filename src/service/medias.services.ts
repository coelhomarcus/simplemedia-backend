import { media, episode } from "@/database/schema";
import { db } from "@/database/db";

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
