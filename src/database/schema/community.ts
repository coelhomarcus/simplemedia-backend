import {
  integer,
  uuid,
  varchar,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const postTable = pgTable("post", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  title: varchar().notNull(),
  content: varchar().notNull(),
  tags: varchar().array().notNull().default([]),
  imgs: varchar().array().notNull().default([]),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
