import {
  uuid,
  pgTable,
  varchar,
  timestamp,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const media = pgTable("media", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  sinopse: varchar().notNull(),
  tags: varchar().array(),
  coverUrl: varchar("cover_url"),
  bannerUrl: varchar("banner_url"),
  isMovie: boolean("is_movie").notNull().default(false),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const episode = pgTable("episode", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mediaId: integer("media_id")
    .notNull()
    .references(() => media.id),
  name: varchar().notNull(),
  episodeNumber: integer("episode_number").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  streamUrl: varchar("stream_url").notNull(),
  subtitleUrl: varchar("subtitle_url"),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const watchProgress = pgTable("watch_progress", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  mediaId: integer("media_id")
    .notNull()
    .references(() => media.id),
  episodeId: integer("episode_id")
    .notNull()
    .references(() => episode.id),
  timestamp: timestamp().notNull(),
  duration: timestamp().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const watchedEpisode = pgTable("watched_episode", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  mediaId: integer("media_id")
    .notNull()
    .references(() => media.id),
  episodeId: integer("episode_id")
    .notNull()
    .references(() => episode.id),
  watchedDate: date("watched_date").notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
